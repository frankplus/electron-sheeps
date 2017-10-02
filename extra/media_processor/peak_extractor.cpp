#include "peak_extractor.hpp"
#include "ffmpeg_error.hpp"

extern "C"
{
#include <libavformat/avformat.h>
#include <libavcodec/avcodec.h>
#include <libswresample/swresample.h>
}


#include <iostream>
#include <algorithm>

PeakExtractor::PeakExtractor(AVStream *stream, int samplesPerPeak) :
    StreamDecoder(stream),
    Resampler(nullptr)
{
    SamplesBuffer = nullptr;
    MaxSamples = -1;
    SamplesPerPeak = samplesPerPeak;
    SamplesRead = 0;

    if(CodecCtx->sample_fmt != AV_SAMPLE_FMT_S16)
    {
        if(Stream->codecpar->channel_layout == 0)
        {
            throw FFmpegError("Could not determine input file channel layout");
        }
        // We need to resample
        Resampler = swr_alloc_set_opts(Resampler,
                                       AV_CH_LAYOUT_MONO,
                                       AV_SAMPLE_FMT_S16,
                                       CodecCtx->sample_rate,
                                       Stream->codecpar->channel_layout,
                                       CodecCtx->sample_fmt,
                                       CodecCtx->sample_rate,
                                       0,
                                       nullptr);
        if(!Resampler)
        {
            throw FFmpegError("Could not create the resampler");
        }

        int ret = swr_init(Resampler);
        if(ret < 0)
        {
            throw FFmpegError(ret);
        }

        Frame = av_frame_alloc();
        if(!Frame)
        {
            throw FFmpegError("Could not allocate frame");
        }
    }
}

PeakExtractor::~PeakExtractor()
{
    av_freep(&SamplesBuffer);
    av_frame_free(&Frame);
    swr_free(&Resampler);
}

void PeakExtractor::push_packet(const AVPacket &pkt)
{
    int res = avcodec_send_packet(CodecCtx, &pkt);

    if(res == AVERROR_EOF)
    {
        std::cout << "Done" << std::endl;
    }
    else if(res == AVERROR(EINVAL))
    {
        throw FFmpegError(res);
    }

    processFrames();
}

void PeakExtractor::processing_finished()
{
    // Let's flush the decoder
    avcodec_send_packet(CodecCtx, nullptr);

    processFrames();

    // Flush resampler
    int samplesConverted;
    while((samplesConverted = swr_convert(Resampler, &SamplesBuffer, MaxSamples, nullptr, 0)) > 0)
    {
        std::cout << "Flushing resampler" << std::endl;
        processSamples(samplesConverted);
    }

    normalizePeaks();
}

void PeakExtractor::processFrames()
{
    int samples = -1;
    int samplesConverted;
    // Ok
    while(avcodec_receive_frame(CodecCtx, Frame) == 0)
    {
        samples = swr_get_out_samples(Resampler, Frame->nb_samples);
        if(samples > MaxSamples)
        {
            av_freep(&SamplesBuffer);
            av_samples_alloc(&SamplesBuffer, nullptr, 1, samples, AV_SAMPLE_FMT_S16, 0);
            MaxSamples = samples;
        }
        samplesConverted = swr_convert(Resampler, &SamplesBuffer, MaxSamples, (const uint8_t**)Frame->data, Frame->nb_samples);
        if(samplesConverted < 0)
        {
            throw FFmpegError(samplesConverted);
        }
        else
        {
            processSamples(samplesConverted);
        }
    }
}

void PeakExtractor::processSamples(int samplesNumber)
{
    int16_t *samples = (int16_t*)SamplesBuffer;
    int16_t *samplesEnd = samples + samplesNumber;
    while(samples != samplesEnd) 
    {
        if(SamplesRead % SamplesPerPeak != 0)
        {
            if(Peaks.back().Max < *samples)
            {
                Peaks.back().Max = *samples;
            }
            else if(Peaks.back().Min > *samples)
            {
                Peaks.back().Min = *samples;
            }
            ++samples;
            ++SamplesRead;
        }
        else
        {
            Peaks.push_back({*samples, *samples});
            ++samples;
            ++SamplesRead;
        }
    }
}

void PeakExtractor::normalizePeaks()
{
    int MinPeak = Peaks[0].Min;
    int MaxPeak = Peaks[0].Max;
    std::for_each(Peaks.begin() + 1, Peaks.end(), [&MinPeak, &MaxPeak](const Peak &p)
    {
        if(p.Min < MinPeak) MinPeak = p.Min;
        else if(p.Max > MaxPeak) MaxPeak = p.Max;
    });

    int MaxAbsValue = std::max(std::abs(MinPeak), std::abs(MaxPeak));

    double NormFactor = 32768.0 / MaxAbsValue;

    std::cout << "Norm factor: " << NormFactor << std::endl;

    if(NormFactor > 1.1)
    {
        // Apply norm factor
        for(auto &peak : Peaks)
        {
            peak.Max = std::round(peak.Max * NormFactor);
            peak.Min = std::round(peak.Min * NormFactor);
        }
    }
}
