#ifndef stream_processor_hpp_INCLUDED
#define stream_processor_hpp_INCLUDED

#include <cstdint>

using std::int64_t;

struct AVPacket;
struct AVCodecContext;
struct AVCodec;
struct AVStream;
struct AVDictionary;

struct ProgressTracker
{
    virtual void progress(int64_t curr, int64_t total) = 0;
};

struct StreamProcessor
{
protected:
    AVStream *Stream;

public:
    StreamProcessor(AVStream *stream) :
        Stream(stream)
    { }

    virtual ~StreamProcessor();
    virtual void push_packet(const AVPacket &pkt) = 0;

    // Useful for doing things like flushing
    // By default, it does nothing
    virtual void processing_finished() { }

    StreamProcessor(const StreamProcessor &other) = delete;
    StreamProcessor(StreamProcessor &&other) = delete;

    void operator=(const StreamProcessor &other) = delete;

    const AVStream *stream() const
    {
        return Stream;
    }

};

class StreamDecoder : public StreamProcessor
{
protected:
    AVCodecContext *CodecCtx;
    AVCodec *Codec;

public:
    StreamDecoder(AVStream *stream);

    virtual ~StreamDecoder();

};

#endif // stream_processor_hpp_INCLUDED

