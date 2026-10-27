# Naman Weds Shubhangi — interactive wedding invitation

## Included
- Mobile-friendly invitation website
- Engagement, Haldi, Mehndi, Sangeet and Wedding cards
- Google Maps search links for venues
- Countdown timer
- Floating/fluttering decorative doodles
- Separate music controls for welcome, engagement, Haldi, Mehndi, Sangeet and Wedding
- Outfit selection form and RSVP fields

## Preview locally
Open `index.html` in a modern browser. Most features work immediately.
Music is intentionally not bundled. Add MP3 files that you own or have permission to use into the `music/` folder:
- `welcome.mp3`
- `engagement.mp3`
- `haldi.mp3`
- `mehndi.mp3`
- `sangeet.mp3`
- `wedding.mp3`

Until Google Sheets is connected, form responses are stored only in the current browser/device as a demo. They are NOT sent to you and will not be shared across guests.

## Connect submissions to Google Sheets for free
1. Create a new Google Sheet with columns:
   `Submitted At, Name, Party Size, Attendance, Phone, Haldi Male, Haldi Female, Mehndi Male, Mehndi Female, Sangeet Male, Sangeet Female, Other Details`
2. In the Sheet, open **Extensions → Apps Script**.
3. Replace the script editor contents with:

```javascript
const SHEET_NAME = 'Responses';
function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME)
    || SpreadsheetApp.getActiveSpreadsheet().insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Submitted At','Name','Party Size','Attendance','Phone',
      'Haldi Male','Haldi Female','Mehndi Male','Mehndi Female',
      'Sangeet Male','Sangeet Female','Other Details']);
  }
  sheet.appendRow([
    new Date(), data.name || '', data.partySize || '', data.attendance || '',
    data.phone || '', data.haldiMale || '', data.haldiFemale || '',
    data.mehndiMale || '', data.mehndiFemale || '', data.sangeetMale || '',
    data.sangeetFemale || '', data.otherDetails || ''
  ]);
  return ContentService.createTextOutput(JSON.stringify({ok:true}))
    .setMimeType(ContentService.MimeType.JSON);
}
```
4. Save the project. Select **Deploy → New deployment → Web app**.
5. Set **Execute as: Me**. Set access to **Anyone** if your Google account/organization allows it. Deploy, authorize it, and copy the Web app URL.
6. In `index.html`, find `const SCRIPT_URL=""` and paste the URL between the quotation marks.
7. Upload the updated site files to a static host such as Cloudflare Pages or GitHub Pages.

Important: anyone with the public form URL may submit responses. Do not collect sensitive personal data. Test with a sample entry and check the Sheet before sharing the invitation widely.

## Free hosting
- Cloudflare Pages: create a project and upload/deploy these site files.
- GitHub Pages: create a repository, upload the files and enable Pages in repository settings.
Both are static hosting options with plan limits and terms that may change.

## Details to confirm
- The invitation versions show Sangeet at both 7 PM and 8 PM. The template currently uses 7 PM.
- Confirm venue spelling/address and event timings before sharing publicly.
