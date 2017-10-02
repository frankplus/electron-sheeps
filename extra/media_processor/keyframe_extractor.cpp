#include "keyframe_extractor.hpp"
#include "ffmpeg_error.hpp"

extern "C"
{
#include <libavcodec/avcodec.h>
#include <libavformat/avformat.h>
#include <libavutil/opt.h>
}

#include <iostream>

KeyFrameExtractor::KeyFrameExtractor(AVStream *stream) :
    StreamDecoder(stream)
{
    if(av_opt_set(CodecCtx, "skip_frame", "nokey", 0) < 0)
    {
        throw FFmpegError("Sanity check, could not set skip_frame option");
    }
    Frame = av_frame_alloc();
    if(!Frame)
    {
        throw FFmpegError("Could not allocate frame");
    }
    TimeBase = av_q2d(stream->time_base);
    std::cout << "Start time (s): " << (stream->start_time * TimeBase) << std::endl;
}

KeyFrameExtractor::~KeyFrameExtractor()
{
    av_frame_free(&Frame);
}

void KeyFrameExtractor::push_packet(const AVPacket &pkt)
{
    int res = avcodec_send_packet(CodecCtx, &pkt);

    if(res == AVERROR_EOF)
    {
        std::cout << "Done";
    }
    else if(res == AVERROR(EINVAL))
    {
        throw FFmpegError(res);
    }

    // Ok
    while(avcodec_receive_frame(CodecCtx, Frame) == 0)
    {
        //if(Frame->key_frame == 0) std::cout << "No keyframe" << std::endl;
        TimePoints.push_back(av_frame_get_best_effort_timestamp(Frame) * TimeBase * 1000.0);
        //av_frame_unref(frame);
    }
   

}

void KeyFrameExtractor::processing_finished()
{
    // Let's flush the decoder
    avcodec_send_packet(CodecCtx, nullptr);
    while(avcodec_receive_frame(CodecCtx, Frame) == 0)
    {
        //if(Frame->key_frame == 0) std::cout << "No keyframe" << std::endl;
        TimePoints.push_back(av_frame_get_best_effort_timestamp(Frame) * TimeBase * 1000.0);
        //av_frame_unref(frame);
    }
}
