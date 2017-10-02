#include "ffmpeg_error.hpp"

extern "C"
{
#include <libavutil/avutil.h>
}

std::string makeErrorMessage(int error)
{
    char error_buf[AV_ERROR_MAX_STRING_SIZE];
    av_strerror(error, error_buf, AV_ERROR_MAX_STRING_SIZE);
    return std::string(error_buf);
}

FFmpegError::FFmpegError(int error) :
    ErrorMessage(makeErrorMessage(error))
{ }

const char *FFmpegError::what() const noexcept
{
    return ErrorMessage.c_str();
}
