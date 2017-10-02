#ifndef media_file_hpp_INCLUDED
#define media_file_hpp_INCLUDED

extern "C"
{
#include <libavformat/avformat.h>
}

#include <string>
#include <vector>
#include <algorithm>

class StreamProcessor;
class ProgressTracker;

class MediaFile
{

    friend class MediaProcessor;
    
    AVFormatContext *FormatCtx;

public:
    MediaFile(const char *filename);
    MediaFile(const std::string &filename);

    ~MediaFile();

    AVStream **begin();

    AVStream **end();

    std::size_t streams_number() const;

    AVStream **best_stream(AVMediaType type);

    template <class OutputIterator>
    OutputIterator audio_streams(OutputIterator out)
    {
        return streams_of_type(AVMEDIA_TYPE_AUDIO, out);
    }

    template <class OutputIterator>
    OutputIterator video_streams(OutputIterator out)
    {
        return streams_of_type(AVMEDIA_TYPE_VIDEO, out);
    }


private:

    template <class OutputIterator>
    OutputIterator streams_of_type(enum AVMediaType type, OutputIterator out)
    {
        return std::copy_if(begin(), end(), out, [type] (AVStream *stream) {
                            return stream->codecpar->codec_type == type;
        });
    }
};

#endif // media_file_hpp_INCLUDED

