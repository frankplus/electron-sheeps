#include "media_file.hpp"
#include "ffmpeg_error.hpp"
#include "stream_processor.hpp"

MediaFile::MediaFile(const char *filename) :
    FormatCtx(nullptr)
{
    // Open the input file
    int result = avformat_open_input(&FormatCtx, filename, nullptr, nullptr);
    if(result < 0)
    {
        FormatCtx = nullptr;
        throw FFmpegError(result);
    }

    // Retrieve stream informations
    result = avformat_find_stream_info(FormatCtx, nullptr);
    if(result < 0)
    {
        // Cleanup data
        avformat_close_input(&FormatCtx);
        FormatCtx = nullptr;

        throw FFmpegError(result);
    }
}

MediaFile::MediaFile(const std::string &filename) :
    MediaFile(filename.c_str())
{ }

MediaFile::~MediaFile()
{
    avformat_close_input(&FormatCtx);
}

AVStream **MediaFile::begin()
{
    return FormatCtx->streams;
}

AVStream **MediaFile::end()
{
    return FormatCtx->streams + FormatCtx->nb_streams;
}

std::size_t MediaFile::streams_number() const
{
    return FormatCtx->nb_streams;
}

AVStream **MediaFile::best_stream(AVMediaType type)
{
    int idx = av_find_best_stream(FormatCtx, type, -1, -1, nullptr, 0);
    return (idx < 0) ? end() : (FormatCtx->streams + idx);

}
