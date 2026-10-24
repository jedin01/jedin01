# Abner Lourenço · portfolio

Personal portfolio of Abner Lourenço, backend software engineer working with Camunda 8,
Zeebe, BPMN and DMN, Java and Spring Boot. Built with Jekyll, which GitHub Pages runs on
every push. `README.md` stays as the GitHub profile README and is not part of the site.

## Structure

```
index.html            Home
work/  about/         Work (experience, projects) and About
articles/             Article list; articles live in _posts/
gallery/              Photo gallery; photos are listed in _data/gallery.yml
write/                Write an article or add a photo (opens GitHub with the file ready)
_data/                Projects, experience and gallery
_layouts/ _includes/  Page layout, BPMN diagram, cards
assets/               CSS, JS, images (assets/gallery/ for photos)
```

## Writing an article

Open `/jedin01/write/`, fill in the title and the text in Markdown, and press
**Publish on GitHub**. GitHub opens with `_posts/YYYY-MM-DD-title.md` ready: press
**Commit changes**. You can also create that file directly on GitHub.

## Adding a photo

Upload the image to `assets/gallery/` and add an entry to `_data/gallery.yml`
(the Photo tab on `/jedin01/write/` prepares it for you).

## Run locally

```sh
gem install jekyll
jekyll serve --baseurl /jedin01
# open http://localhost:4000/jedin01/
```

## Publishing (GitHub Pages)

In *Settings → Pages → Build and deployment*, choose **Deploy from a branch**, branch
`main`, folder `/ (root)`. The site is published at https://jedin01.github.io/jedin01/.

## Notes

- **Contrast:** `#3399F3` is never used for small text; links and buttons use `#1C6FC4`.
- **Motion:** with "reduce motion" enabled, everything is shown immediately and the diagram stops.
