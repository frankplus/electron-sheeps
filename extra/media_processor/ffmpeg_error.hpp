#ifndef ffmpeg_error_hpp_INCLUDED
#define ffmpeg_error_hpp_INCLUDED

#include <exception>
#include <string>

class FFmpegError : public std::exception
{
    std::string ErrorMessage;

public:
    FFmpegError(int error);

    FFmpegError(const std::string &errorMessage) :
        std::exception(),
        ErrorMessage(errorMessage)
    { }

    virtual ~FFmpegError() { }

    virtual const char *what() const noexcept override;
};

#endif // ffmpeg_error_hpp_INCLUDED

