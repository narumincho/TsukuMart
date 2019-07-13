$Host.UI.RawUI.ForegroundColor = "Yellow";
Write-Output "Compile Client Code And Upload Firebase Server";
Set-Location -Path ./client/src;

Write-Output "Compile Elm ...";
$Host.UI.RawUI.ForegroundColor = "Gray";
elm make ./elm-src/Main.elm --output ./beforeMinifiy.js --optimize;
$Host.UI.RawUI.ForegroundColor = "Yellow";
Write-Output "Compile Elm OK";

$Host.UI.RawUI.ForegroundColor = "Yellow";
Write-Output "Minify JavaScript ...";
$Host.UI.RawUI.ForegroundColor = "Gray";
uglifyjs ./beforeMinifiy.js -o ../dist/main.js;
Remove-Item ./beforeMinifiy.js;
$Host.UI.RawUI.ForegroundColor = "Yellow";
Write-Output "Minify JavaScript OK";

Write-Output "Minify CSS ...";
$Host.UI.RawUI.ForegroundColor = "Gray";
cleancss ./style.css -o ../dist/style.css;
$Host.UI.RawUI.ForegroundColor = "Yellow";
Write-Output "Minify CSS OK"

Write-Output "Call Compile ...";
$Host.UI.RawUI.ForegroundColor = "Gray";
tsc;
$Host.UI.RawUI.ForegroundColor = "Yellow";
Write-Output "Call Compile OK"

Write-Output "ServiceWoker Compile ...";
$Host.UI.RawUI.ForegroundColor = "Gray";
Set-Location -Path ./servicewoker_src;
tsc;
$Host.UI.RawUI.ForegroundColor = "Yellow";
Write-Output "ServiceWoker Compile OK"

Write-Output "Sign Up Compile ..."
$Host.UI.RawUI.ForegroundColor = "Gray";
Set-Location -Path ../signup_src;
Copy-Item -Path ./signup.html -Destination ../../dist/signup
tsc;
$Host.UI.RawUI.ForegroundColor = "Yellow";
Write-Output "ServiceWoker Compile OK"

Write-Output "Upload to Firebase ...";
$Host.UI.RawUI.ForegroundColor = "Gray";
firebase deploy --project tsukumart-f0971 --only hosting;
$Host.UI.RawUI.ForegroundColor = "Yellow";
Write-Output "Upload to Firebase OK";
Write-Output "Complete!";
