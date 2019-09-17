$Host.UI.RawUI.ForegroundColor = "Yellow";
Write-Output "Compile Server Code And Upload Firebase Server";
Set-Location -Path ./server/source;

Write-Output "Compile TypeScript ...";
$Host.UI.RawUI.ForegroundColor = "Gray";
npx tsc;
$Host.UI.RawUI.ForegroundColor = "Yellow";
Write-Output "Compile TypeScript OK";
Set-Location -Path ../;

Write-Output "Copy package.json ...";
$Host.UI.RawUI.ForegroundColor = "Gray";
Copy-Item -Path ./source/package.json -Destination ./distribution/package.json -Recurse -Force
$Host.UI.RawUI.ForegroundColor = "Yellow";
Write-Output "Copy package.json OK";

Write-Output "Upload to Firebase ...";
$Host.UI.RawUI.ForegroundColor = "Gray";
firebase deploy --project tsukumart-f0971 --only functions;
$Host.UI.RawUI.ForegroundColor = "Yellow";
Write-Output "Upload to Firebase OK";
Write-Output "Complete!";