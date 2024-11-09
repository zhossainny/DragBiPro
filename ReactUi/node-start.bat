:: to download Procrun binaries and see documentation visit http://commons.apache.org/daemon/procrun.html

:: this file is used to Reinstall a service each time you run it,
:: if you need to uninstall comment out with "::" the install service line

::detect x86 or x64
echo off

set prunsrv=%~dp0..\..\procrun\prunsrv.exe

::stop service:
::net stop reporting-front-end

::delete service:
::%prunsrv% //DS//reporting-front-end

::install service:
:: ++StartParams is the arguments. arguments are separated with "#"
%prunsrv% //IS//reporting-front-end --DisplayName="QD Reporting Web" --Startup=auto --Install=%prunsrv% --StartMode=exe --StartImage="C:\Program Files\nodejs\node.exe" ++StartParams=%~dp0src\index.js --StdOutput=C:\temp\QdReportingService-Web.service.stdout.log --StdError=C:\temp\QdReportingService-Web.service.stderr.log

::start service:
net start reporting-front-end