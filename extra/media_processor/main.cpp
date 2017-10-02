#include "media_file.hpp"
#include "media_processor.hpp"
#include "peak_extractor.hpp"
#include "ffmpeg_error.hpp"

#include <fstream>

int main(int argc, char *argv[])
{
    if(argc < 3) {
        return 1;
    }

    av_register_all();

    const char *input_filename = argv[1];
    const char *output_filename = argv[2];

        MediaFile media {input_filename};

        const auto best_audio_stream = media.best_stream(AVMEDIA_TYPE_AUDIO);

        if(best_audio_stream == media.end())
        {
            // There is no audio stream
            return 2;
        }


        MediaProcessor processor {media};

        int sample_rate = (*best_audio_stream)->codecpar->sample_rate;
        int samples_per_peak = sample_rate / 100;
        PeakExtractor peak_extractor {*best_audio_stream, samples_per_peak};
        processor.addStreamProcessors(&peak_extractor);
        processor.startProcessing();


        std::ofstream file{output_filename};

        file << sample_rate << "\n";
        file << samples_per_peak;

        for(const auto &peak : peak_extractor.peaks())
        {
            file << "\n";
            file << peak.Min << "\n" << peak.Max;
        }

    return 0;
}
