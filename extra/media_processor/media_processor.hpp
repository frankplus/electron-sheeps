#ifndef media_processor_hpp_INCLUDED
#define media_processor_hpp_INCLUDED

#include <vector>

class StreamProcessor;
class ProgressTracker;
class MediaFile;

class MediaProcessor
{
    using StreamProcessors = std::vector<StreamProcessor*>;

    template <class SP, class... SPs>
    struct StreamProcessorPusher
    {
        static bool push(MediaProcessor &p, SP *proc, SPs*... procs)
        {
            return p.pushStreamProcessor(proc) && StreamProcessorPusher<SPs...>::push(p, procs...);
        }
    };

    template <class SP>
    struct StreamProcessorPusher<SP>
    {
        static bool push(MediaProcessor &p, SP *proc)
        {
            return p.pushStreamProcessor(proc);
        }
    };

    MediaFile &Media;
    int streamsNumber;
    StreamProcessors *Processors;

public:
    MediaProcessor(MediaFile &media);
    ~MediaProcessor();


    template <class SP, class... SPs>
    bool addStreamProcessors(SP *proc, SPs *... procs)
    {
        return StreamProcessorPusher<SP, SPs...>::push(*this, proc, procs...);
    }

    void startProcessing(ProgressTracker *tracker = nullptr);

private:
    bool pushStreamProcessor(StreamProcessor *proc);
};


#endif // media_processor_hpp_INCLUDED

