#ifndef peak_extractor_hpp_INCLUDED
#define peak_extractor_hpp_INCLUDED

#include "stream_processor.hpp"
#include <vector>

struct SwrContext;
struct AVFrame;

struct Peak
{
    int16_t Min;
    int16_t Max;
};

class PeakExtractor : public StreamDecoder
{
    SwrContext *Resampler;
    AVFrame *Frame;

    uint8_t *SamplesBuffer;
    int MaxSamples;

    int SamplesPerPeak;
    int SamplesRead;

    std::vector<Peak> Peaks;
public:
    using Format = int16_t;
    
    PeakExtractor(AVStream *stream, int samplesPerPeak);

    virtual ~PeakExtractor();

    virtual void push_packet(const AVPacket &pkt) override;
    virtual void processing_finished() override;

    const std::vector<Peak> &peaks() const
    {
        return Peaks;
    }

    std::vector<Peak> &peaks()
    {
        return Peaks;
    }

private: 
    void processFrames();

    void processSamples(int samplesNumber);

    void normalizePeaks();
};

#endif // peak_extractor_hpp_INCLUDED

