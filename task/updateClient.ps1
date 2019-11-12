$Host.UI.RawUI.ForegroundColor = "Yellow";
Write-Output "Compile Client Code And Upload Firebase Server";

New-Item -Path ./client/distribution -ItemType Directory -Force

Write-Output "Compile Elm ...";
$Host.UI.RawUI.ForegroundColor = "Gray";
Set-Location -Path ./client/source/main/;
elm make ./elm-source/Main.elm --output ./mainBeforeMinifiy.js --optimize;
elm make ./elm-source/SignUp.elm --output ./signUpBeforeMinifiy.js --optimize;
Copy-Item ../signup.html -Destination ../../distribution/signup
$Host.UI.RawUI.ForegroundColor = "Yellow";
Write-Output "Compile Elm OK";

$Host.UI.RawUI.ForegroundColor = "Yellow";
Write-Output "Minify JavaScript ...";
$Host.UI.RawUI.ForegroundColor = "Gray";
../../../server/source/node_modules\.bin/uglifyjs ./mainBeforeMinifiy.js -o ../../distribution/main.js;
../../../server/source/node_modules\.bin/uglifyjs ./signUpBeforeMinifiy.js -o ../../distribution/signup.js;
Remove-Item ./mainBeforeMinifiy.js;
Remove-Item ./signUpBeforeMinifiy.js;
$Host.UI.RawUI.ForegroundColor = "Yellow";
Write-Output "Minify JavaScript OK";

Write-Output "Minify CSS ...";
$Host.UI.RawUI.ForegroundColor = "Gray";
Set-Location -Path ../;
cleancss ./style.css -o ../distribution/style.css;
$Host.UI.RawUI.ForegroundColor = "Yellow";
Write-Output "Minify CSS OK"

Write-Output "Call (Main) Compile ...";
$Host.UI.RawUI.ForegroundColor = "Gray";
Set-Location -Path ./call/;
tsc;
$Host.UI.RawUI.ForegroundColor = "Yellow";
Write-Output "Call (Main) Compile OK"

Write-Output "Call (SignUp) Compile ...";
$Host.UI.RawUI.ForegroundColor = "Gray";
Set-Location -Path ../signUpCall/;
tsc;
$Host.UI.RawUI.ForegroundColor = "Yellow";
Write-Output "Call (SignUp) Compile OK"


Write-Output "ServiceWoker Compile ...";
$Host.UI.RawUI.ForegroundColor = "Gray";
Set-Location -Path ../servicewoker;
tsc;
$Host.UI.RawUI.ForegroundColor = "Yellow";
Write-Output "ServiceWoker Compile OK"

Write-Output "Copy Assets ...";
$Host.UI.RawUI.ForegroundColor = "Gray";
Set-Location -Path ../
Copy-Item -Path assets -Destination ../distribution -Recurse -Force
Copy-Item -Path manifest.json ../distribution
Copy-Item -Path robots.txt ../distribution
$Host.UI.RawUI.ForegroundColor = "Yellow";
Write-Output "Copy Assets OK"

Write-Output "Upload to Firebase ...";
$Host.UI.RawUI.ForegroundColor = "Gray";
firebase deploy --project tsukumart-f0971 --only hosting;
$Host.UI.RawUI.ForegroundColor = "Yellow";
Write-Output "Upload to Firebase OK";
Write-Output "Complete!";
