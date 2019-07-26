@ECHO OFF
SET SvcName=Conan-Bot

SC QUERYEX "%SvcName%" | FIND "STATE" | FIND /v "RUNNING" > NUL && (
    ECHO %SvcName% is not running
    ECHO START %SvcName%

    NET START "%SvcName%" > NUL || (
        ECHO "%SvcName%" wont start
        EXIT /B 1
    )
    ECHO "%SvcName%" is started
    EXIT /B 0
) || (
    ECHO "%SvcName%" is running
    EXIT /B 0
)