# Embedding the page guide

Copy `page-guide.js`, `page-guide.css`, `page-knowledge.js` and `local-guide-voice.js` into the same directory on your site. Load the three scripts in the order shown below. The guide works on a static page and does not need an API key or server endpoint.

```html
<section id="delivery" data-guide-source="Delivery">
  <h2>Delivery</h2>
  <p>Orders ship on Tuesdays and Thursdays.</p>
  <div data-guide-private>Internal note omitted from answers.</div>
</section>

<local-page-guide id="shopGuide"></local-page-guide>
<button type="button" data-open-page-guide aria-controls="shopGuide"
        aria-expanded="false">Ask the guide</button>

<script src="guide/page-knowledge.js" defer></script>
<script src="guide/local-guide-voice.js" defer></script>
<script src="guide/page-guide.js" defer></script>
```

Give each shared section an ID so the guide can link visitors back to it. Use the value of `data-guide-source` as its visitor-facing name. Without a shared section, the guide has no page content to answer from. To use a portrait like the portfolio’s, put same-site video and poster paths in the widget’s optional `data-video` and `data-poster` attributes.

The guide reads current text, headings, lists and links in the marked sections when a visitor asks a question. It can use the contents of a native expandable details element. It skips hidden and private content, form fields and the guide itself. It can point to a linked page or document without reading its contents. Each page on a multipage portal supplies its own grants. These markers limit this feature’s reading scope. Use the portal’s normal access controls to decide which information to deliver to a visitor’s browser in the first place.

A grant covers its descendants. Mark a nested private area with `data-guide-private`, even when it sits inside a shared section. Removing a top-level grant clears the widget’s conversation and the next answer uses the remaining grants.

Visitors can type, use the microphone for one question at a time, ask a short follow-up, or open a cited source. The latest six exchanges stay in the open page’s memory and **Clear chat** removes them. Answers use local matching and excerpts from the shared page. They do not use an external AI service. Local English dictation and a recognized local masculine English speaking voice are independent device capabilities. Missing either leaves typing and displayed answers available.

The guide builds its starter questions from the shared text. After an answer, **Ask next** offers questions about the current topic. Asking **Tell me more** moves through the published details. On-page citations return to their source section, and related links are labeled separately. During playback, **Stop speaking** interrupts just the current reply. Set the optional `data-title` attribute on the widget to give the guide a site-specific name.

If the browser offers an English dictation pack, the visitor can choose **Download English voice input** and then tap the microphone again. The browser handles the pack download. The guide does not upload audio or automatically start recording after installation.
