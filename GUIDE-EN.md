# Stream Danke — English User Guide

Updated: 14 October 2026

# Your stream ending scene.

A local 1920 × 1080 OBS ending scene thanking new followers and incoming raids, with rotating name pages and a general thank-you page. No subscriptions, Bits or Affiliate features are required. The minimalist design uses upright sans-serif fonts, orange, charcoal and warm white. This guide is bilingual; the overlay itself remains in German.

<a href="Vorschau.html" class="button">Open sample-data preview</a>

**Included:** overlay, animation, event collector and documentation.  
**Manual setup:** four streamer.bot actions, one OBS Browser Source and a Stream Deck scene button. The files do not configure your applications automatically.

## 1 · Extract the files

1.  Extract the complete package into a folder named `Stream-Danke` in your Windows **Documents** folder. Press `Win + R` and enter `shell:Personal` to find the actual folder, including OneDrive-redirected Documents.
2.  The resulting path must be `Documents\Stream-Danke\overlay.html`. Avoid an additional nested `Stream-Danke\Stream-Danke` level. Keep all supporting files and the `streamerbot` subfolder together.
3.  Open `Vorschau.html` for clearly marked fictional sample names. The production `overlay.html` initially shows only a general thank-you.

For another location, change the `Folder` property in **all four** C# files to the same absolute, writable directory. Back up your existing OBS and streamer.bot configuration before making changes.

## 2 · Connect Twitch and OBS to streamer.bot

Connect your own Twitch account as **Broadcaster** and configure the OBS connection. Follow events require working Twitch authorization; reconnect the Broadcaster account if necessary. Affiliate status is not required.

In OBS, enable the WebSocket server under **Tools → WebSocket Server Settings**. In streamer.bot, use **Stream Apps → OBS** and enter the matching address, port and password. Reuse an existing working connection. This overlay does not need streamer.bot's own WebSocket server.

## 3 · Create four actions

Under **Actions**, create four enabled actions. Each gets exactly one sub-action: **Core → C# → Execute C# Code**. Paste the full contents of the corresponding file, click **Compile** and save. If Newtonsoft.Json references are missing, use **Find Refs** and compile again. Suggested action labels below match the German guide; you may rename the actions.

| Action | Code file | Trigger | Effect |
| --- | --- | --- | --- |
| Danke · Start | [01-Start.cs.txt](streamerbot/01-Start.cs.txt) | OBS Studio → Streaming Started; Select your active OBS connection. | Start a new empty session. |
| Danke · Follower | [02-Follower.cs.txt](streamerbot/02-Follower.cs.txt) | Twitch → Channel → Follow | Save a new follower, once per session. |
| Danke · Raid | [03-Raid.cs.txt](streamerbot/03-Raid.cs.txt) | Twitch → Raid → Raid; Leave Min/Max blank. Enable “Always Run” if other raid triggers use value ranges. | Save an incoming raid and viewer count. |
| Danke · Stop | [04-Stop.cs.txt](streamerbot/04-Stop.cs.txt) | OBS Studio → Streaming Stopped; Select the same OBS connection. | Close collection; names remain visible. |

Menu labels may vary by version. Use the incoming **Raid** trigger, not “Raid Start” or “Raid Send”, which concern outgoing raids.

**Before every stream:** streamer.bot must be running and connected to Twitch and OBS before you start streaming. Each actual OBS stream start clears the previous session, including when restarting after a brief stop.  
  
**Already live during setup?** Run “Danke · Start” once using the trigger's **Test Trigger** option. Only subsequent events are collected; earlier events are not backfilled.

## 4 · Create the OBS scene

1.  Create a scene named **Ende · Danke**.
2.  Add a **Browser** source named **Danke-Abspann**.
3.  Enable **Local file** and select `Documents\Stream-Danke\overlay.html`. Do not use the preview file for your live stream.
4.  Set width **1920**, height **1080**; 30 FPS is sufficient. On a smaller OBS canvas, right-click the source and select **Transform → Fit to Screen**.
5.  Enable **Refresh browser source when scene becomes active**. Optionally enable **Shutdown source when not visible**: the collector runs in streamer.bot and continues when the browser source is unloaded.

Follower pages contain eight names; raid pages contain three raids. A general thank-you page follows, and the sequence repeats. Empty categories are skipped. Data is polled every two seconds; new entries appear on the next page transition. Without events, only the general thank-you is shown. Music is not included; add your own audio source if desired.

## 5 · Stream Deck “Danke” button

1.  In the Stream Deck app, assign an **OBS Studio → Scene** action to a button.
2.  Select your scene collection and **Ende · Danke**. Give the button a title such as **DANKE**.
3.  Press it at the end of the stream, keep broadcasting until every page has been shown, then stop streaming.

With OBS Studio Mode enabled, you may also need to trigger **Preview to Program** or your transition. Test this locally.

The button switches scenes only. It does not stop streaming or erase names. The counter, for example **01 / 04**, shows the number of pages. At 12 seconds per page, four pages take about 48 seconds.

## 6 · Test before going live

1.  Run the Start trigger with **Test Trigger**. The folder should now contain `session.json`, and `data.js` should be updated.
2.  Test the Follow and Raid triggers. Each needs a name in `user` or `userName`; a raid should also have `viewers`. Depending on your version, trigger tests may supply sample values. If they do not, temporarily add **Set Argument** sub-actions before the code: `user = Testgast`, `userName = testgast`, `userId = test-001`, and for the raid `viewers = 7`. Remove these temporary sub-actions afterwards.
3.  Switch to the ending scene and check the name and raid count. Switch away, add more test events, and return. Those events should appear too. Use different test users to check multiple follower pages and long names.
4.  Test Stop, then test another follow: it must not be collected. Existing names should remain visible.
5.  Remove test data by testing Start again, then Stop. The list is now empty; the next real stream start activates collection.

## Customize text, colors and timing

Edit `config.js` in a text editor, save and refresh the OBS source. `channel` is an optional heading, `subtitle` the subtitle, `footer` an optional footer, and `pageSeconds` the page duration (minimum four seconds, default twelve). `accent` and `warmAccent` accept six-digit hexadecimal colors such as `#f3a536`. The dark orange background gradient is defined separately in `style.css` and does not change automatically with those settings. Replace `logo.png` with your own authorized logo when adapting the project for another channel. The overlay uses local system fonts and loads no external fonts or scripts.

## Troubleshooting

- **Preview works, real names are missing:** run Start, check Twitch connectivity and triggers, and search streamer.bot logs for `[Stream-Danke]`. Inspect `session.json` to see whether events were saved.
- **“overlay.html fehlt” error:** use `shell:Personal` to check the actual Documents folder, or update `Folder` in all four actions.
- **Saved names do not appear in OBS:** ensure the selected `overlay.html` and updated `data.js` are in the same folder, then refresh the Browser Source manually.
- **After a crash:** saved state survives process restarts. If streamer.bot missed the stop event, test Stop to close collection. Start intentionally erases the previous session.
- **streamer.bot was offline:** missed events cannot be reconstructed by this collector.
- **Corrupt session.json:** back it up, then run Start to create a new session. Follow/Raid actions do not silently replace corrupt session data.

## Technical scope and verification

The code writes local `session.json` and `data.js` files and sends no chat messages. A shared lock orders concurrent actions; each file is replaced atomically. Followers are deduplicated, while separate raids from the same channel remain separate entries. The preview does not modify session files. The two output files are written sequentially, not as one transaction.

`PRUEFUNG.txt` records the original development checks and their limitations. This documentation update does not constitute a new live Twitch, OBS, streamer.bot or Stream Deck test. Verify your installed setup before live use.

## Disclaimer

Software and documentation are provided without assurances of functionality, availability, completeness or fitness for a particular purpose. Changes to Twitch, OBS Studio, streamer.bot or other dependencies may affect operation. Test the setup and back up your configuration before live use.

To the extent permitted by applicable law, the authors and copyright holders accept no liability for damage, data loss, stream interruptions or lost revenue resulting from use. Mandatory statutory rights and liabilities that cannot lawfully be excluded remain unaffected. In particular, liability for intentional misconduct, gross negligence or injury to life, body or health is not excluded. This general notice does not replace an individual legal review.

## Open-source license and trademarks

Original project code and documentation are provided under the **MIT License (SPDX: MIT)**. It permits use, modification and redistribution, including commercial use, subject to retaining required copyright and license notices. The complete governing English text is included in [LICENSE](LICENSE); this summary does not replace it.

**The channel logo `logo.png` is excluded.** Its inclusion as the original channel's asset does not grant an open license to redistribute it separately, modify it or use it as your own branding. Replace it with your own or appropriately licensed logo when adapting the project for another channel. Remove the personal logo before public redistribution unless the rights holder has separately authorized that redistribution.

Third-party software, system fonts and other components retain their respective licenses. OBS Studio, streamer.bot and Stream Deck are not bundled here. Product names and trademarks belong to their respective owners. This is an independent project with no claimed official affiliation or endorsement. See [NOTICE.txt](NOTICE.txt).

## Data and redistribution

Follower and raid names become visible on stream. Local session files also store user identifiers and, for raids, viewer counts and UTC timestamps. Stop closes collection without deleting data; the next Start replaces the previous session. Before sharing the package, remove personal session data, credentials and personal paths, and restore `data.js` to its empty distribution state. Restarting an application alone does not erase the session.

## Official references

**Offizielle Referenzen / Official references**

[Follower-Trigger](https://docs.streamer.bot/api/triggers/twitch/channel/follow) · [Eingehender Raid](https://docs.streamer.bot/api/triggers/twitch/raid/raid) · [OBS-Streamstart](https://docs.streamer.bot/api/triggers/obs-studio/streaming-started) · [OBS-Streamstopp](https://docs.streamer.bot/api/triggers/obs-studio/streaming-stopped) · [C#-Sub-Action](https://docs.streamer.bot/api/sub-actions/core/csharp/execute-csharp-code) · [OBS-Browserquelle](https://obsproject.com/kb/browser-source) · [Elgato: OBS-Integration](https://help.elgato.com/hc/en-us/articles/360028239431--Elgato-Stream-Deck-OBS-Studio-Integration)
