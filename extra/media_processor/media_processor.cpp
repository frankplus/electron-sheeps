#include "media_processor.hpp"

#include "media_file.hpp"
#include "stream_processor.hpp"

#include <algorithm>

MediaProcessor::MediaProcessor(MediaFile &media) :
    Media(media)
{
    streamsNumber = std::distance(Media.begin(), Media.end());
    Processors = new StreamProcessors[streamsNumber];
}

MediaProcessor::~MediaProcessor()
{
    delete[] Processors;
}

bool MediaProcessor::pushStreamProcessor(StreamProcessor *proc)
{
    auto streamIndex = proc->stream()->index;
    if(streamIndex >= streamsNumber)
    {
        return false;
    }
    else
    {
        Processors[streamIndex].push_back(proc);
        return true;
    }
}

void MediaProcessor::startProcessing(ProgressTracker *tracker)
{
    AVPacket pkt;
    av_init_packet(&pkt);
    pkt.data = nullptr;
    pkt.size = 0;

    int64_t length = 0;
    if(Media.FormatCtx->pb && tracker)
    {
        length = avio_size(Media.FormatCtx->pb);
        tracker->progress(0, length);
    }

    while(av_read_frame(Media.FormatCtx, &pkt) >= 0)
    {
        for(auto &processor : Processors[pkt.stream_index])
        {
            processor->push_packet(pkt);
        }
        av_packet_unref(&pkt);
        if(Media.FormatCtx->pb && tracker)
        {
            tracker->progress(Media.FormatCtx->pb->pos, length);
        }
    }
    // Notify the processors that processing has finished
    std::for_each(Processors, Processors + streamsNumber, [] (StreamProcessors &procs)
    {
        for(auto &proc : procs)
        {
            proc->processing_finished();
        }
    });
    if(Media.FormatCtx->pb && tracker)
    {
        tracker->progress(Media.FormatCtx->pb->pos, length);
    }
}
