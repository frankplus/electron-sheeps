ffmpeg_cflags = $(shell pkg-config --cflags libavformat libavcodec libavutil libswresample)
ffmpeg_libs = $(shell pkg-config --libs libavformat libavcodec libavutil libswresample)

CXXFLAGS = -std=c++14 $(ffmpeg_cflags) -O2
LIBS = $(ffmpeg_libs)

OBJECTS = .ffmpeg_error.o .keyframe_extractor.o .main.o .media_file.o .media_processor.o .peak_extractor.o .stream_processor.o

all: $(OBJECTS)
	g++ $(CXXFLAGS) -o pex $(OBJECTS) $(LIBS)

.ffmpeg_error.o: ffmpeg_error.cpp ffmpeg_error.hpp
	g++ -c $(CXXFLAGS) $< -o $@
.keyframe_extractor.o: keyframe_extractor.cpp keyframe_extractor.hpp
	g++ -c $(CXXFLAGS) $< -o $@
.main.o: main.cpp media_processor.hpp media_file.hpp peak_extractor.hpp
	g++ -c $(CXXFLAGS) $< -o $@
.media_file.o: media_file.cpp media_file.hpp
	g++ -c $(CXXFLAGS) $< -o $@
.media_processor.o: media_processor.cpp media_processor.hpp
	g++ -c $(CXXFLAGS) $< -o $@
.peak_extractor.o: peak_extractor.cpp peak_extractor.hpp
	g++ -c $(CXXFLAGS) $< -o $@
.stream_processor.o: stream_processor.cpp stream_processor.hpp
	g++ -c $(CXXFLAGS) $< -o $@

.PHONY: clean

clean:
	rm $(OBJECTS)
	rm pex
