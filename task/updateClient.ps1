$Host.UI.RawUI.ForegroundColor = "Yellow";
Write-Output "Compile Client Code And Upload Firebase Server";

Write-Output "Compile Elm ...";
$Host.UI.RawUI.ForegroundColor = "Gray";
Set-Location -Path ./client/src/main/;
elm make ./src/Main.elm --output ./mainBeforeMinifiy.js --optimize;
elm make ./src/SignUp.elm --output ./signUpBeforeMinifiy.js --optimize;
$Host.UI.RawUI.ForegroundColor = "Yellow";
Write-Output "Compile Elm OK";

$Host.UI.RawUI.ForegroundColor = "Yellow";
Write-Output "Minify JavaScript ...";
$Host.UI.RawUI.ForegroundColor = "Gray";
uglifyjs ./mainBeforeMinifiy.js -o ../../dist/main.js;
uglifyjs ./signUpBeforeMinifiy.js -o ../../dist/signup.js;
Remove-Item ./mainBeforeMinifiy.js;
Remove-Item ./signUpBeforeMinifiy.js;
$Host.UI.RawUI.ForegroundColor = "Yellow";
Write-Output "Minify JavaScript OK";

Write-Output "Minify CSS ...";
$Host.UI.RawUI.ForegroundColor = "Gray";
Set-Location -Path ../;
cleancss ./style.css -o ../dist/style.css;
$Host.UI.RawUI.ForegroundColor = "Yellow";
Write-Output "Minify CSS OK"

Write-Output "Call Compile ...";
$Host.UI.RawUI.ForegroundColor = "Gray";
Set-Location -Path ./call/;
tsc;
$Host.UI.RawUI.ForegroundColor = "Yellow";
Write-Output "Call Compile OK"

Write-Output "ServiceWoker Compile ...";
$Host.UI.RawUI.ForegroundColor = "Gray";
Set-Location -Path ../servicewoker;
tsc;
$Host.UI.RawUI.ForegroundColor = "Yellow";
Write-Output "ServiceWoker Compile OK"

Write-Output "Upload to Firebase ...";
$Host.UI.RawUI.ForegroundColor = "Gray";
firebase deploy --project tsukumart-f0971 --only hosting;
$Host.UI.RawUI.ForegroundColor = "Yellow";
Write-Output "Upload to Firebase OK";
Write-Output "Complete!";
