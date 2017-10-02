#include "stream_processor.hpp"
#include "ffmpeg_error.hpp"

extern "C"
{
#include <libavformat/avformat.h>
#include <libavcodec/avcodec.h>
}


StreamProcessor::~StreamProcessor() { }

StreamDecoder::StreamDecoder(AVStream *stream) :
    StreamProcessor(stream)
{
    AVCodecParameters *parameters = Stream->codecpar;
    Codec = avcodec_find_decoder(parameters->codec_id);
    if(!Codec)
    {
        throw FFmpegError("Could not find codec");
    }

    CodecCtx = avcodec_alloc_context3(Codec);
    if(!CodecCtx)
    {
        throw FFmpegError("Could not allocate decoder");
    }

    if(avcodec_parameters_to_context(CodecCtx, parameters) < 0)
    {
        throw FFmpegError("Could not copy decoder data");
    }

    if(avcodec_open2(CodecCtx, Codec, nullptr) < 0)
    {
        throw FFmpegError("Error while opening decoder");
    }
}

StreamDecoder::~StreamDecoder()
{
    avcodec_free_context(&CodecCtx);
}
