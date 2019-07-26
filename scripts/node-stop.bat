@ECHO OFF
SET SvcName=Conan-Bot
 
SC QUERYEX "%SvcName%" | FIND "STATE" | FIND /v "STOPPED" > NUL && (
    ECHO %SvcName% is stopped 
    ECHO STOP %SvcName%
 
    NET STOP "%SvcName%" > NUL || (
        ECHO "%SvcName%" wont stop 
        EXIT /B 1
    )
    ECHO "%SvcName%" is stopped
    EXIT /B 0
) || (
    ECHO "%SvcName%" is stopped
    EXIT /B 0
)