$Host.UI.RawUI.ForegroundColor = "Yellow";
Write-Output "Compile Client Code And Upload Firebase Server";

New-Item -Path ./distribution -ItemType Directory -Force

Write-Output "Compile Elm ...";
$Host.UI.RawUI.ForegroundColor = "Gray";
elm make ./source/elm/Main.elm --output ./distribution/main.js --optimize;
elm make ./source/elm/SignUp.elm --output ./distribution/signup.js --optimize;
Copy-Item ./source/signup.html -Destination ./distribution/signup
$Host.UI.RawUI.ForegroundColor = "Yellow";
Write-Output "Compile Elm OK";

Write-Output "Call (Main) Compile ...";
$Host.UI.RawUI.ForegroundColor = "Gray";
npx tsc --project .;
$Host.UI.RawUI.ForegroundColor = "Yellow";
Write-Output "Call (Main) Compile OK"

Write-Output "Call (SignUp) Compile ...";
$Host.UI.RawUI.ForegroundColor = "Gray";
npx tsc --project ./source/signUpCall;
$Host.UI.RawUI.ForegroundColor = "Yellow";
Write-Output "Call (SignUp) Compile OK"


Write-Output "ServiceWoker Compile ...";
$Host.UI.RawUI.ForegroundColor = "Gray";
npx tsc --project ./source;
$Host.UI.RawUI.ForegroundColor = "Yellow";
Write-Output "ServiceWoker Compile OK"

Write-Output "Copy Assets ...";
$Host.UI.RawUI.ForegroundColor = "Gray";
Copy-Item -Path source/assets -Destination ./distribution -Recurse -Force
Copy-Item -Path source/manifest.json ./distribution
Copy-Item -Path source/robots.txt ./distribution
$Host.UI.RawUI.ForegroundColor = "Yellow";
Write-Output "Copy Assets OK"

# Write-Output "Upload to Firebase ...";
# $Host.UI.RawUI.ForegroundColor = "Gray";
# firebase deploy --project tsukumart-f0971 --only hosting;
# $Host.UI.RawUI.ForegroundColor = "Yellow";
# Write-Output "Upload to Firebase OK";
# Write-Output "Complete!";
