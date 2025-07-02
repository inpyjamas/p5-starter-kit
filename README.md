# P5.js Starter Kit
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

A opinionated p5.js starter kit. Generates zp files on the fly using always the latest version of:

- p5.js
- p5.sound.js
- p5.easing.js

Some additional files are included to make it easier to hit the ground running.

- .editorconfig
- .vscode/settings.json (open folder in VSCode)
- .vscode/extensions.json (extensions to have in VSCode)
- index.html (basic HTML5 boilerplate)
- index.js (basic p5.js boilerplate)

## API Usage

The starter kit generator provides an API endpoint that can be customized with URL parameters:

### Basic Usage

- `/api/package` - Downloads full kit with latest versions
- `/api/package?minimal=true` - Downloads minimal kit (no dev config files)

### Version Specification

You can specify exact versions for each package:

- `/api/package?p5=1.4.0` - Use specific p5.js version
- `/api/package?p5-easing=1.0.0` - Use specific p5-easing version
- `/api/package?p5=1.4.0&p5-easing=1.0.0` - Specify both versions
- `/api/package?p5=1.4.0&minimal=true` - Combine with minimal mode

### Error Handling

- Returns **404** if specified version doesn't exist
- Returns **500** for other server errors
- Error responses include JSON with descriptive messages

### Examples

```bash
# Latest versions (default)
curl -O https://your-domain.com/api/package

# Specific p5.js version
curl -O "https://your-domain.com/api/package?p5=1.4.0"

# Both packages with specific versions
curl -O "https://your-domain.com/api/package?p5=1.4.0&p5-easing=1.0.0"

# Minimal kit with specific version
curl -O "https://your-domain.com/api/package?p5=1.4.0&minimal=true"
```

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://fabianmoronzirfas.me/"><img src="https://avatars.githubusercontent.com/u/315106?v=4?s=128" width="128px;" alt="Fabian Morón Zirfas"/><br /><sub><b>Fabian Morón Zirfas</b></sub></a><br /><a href="https://github.com/inpyjamas/@inpyjamas/p5kit/commits?author=ff6347" title="Code">💻</a> <a href="#infra-ff6347" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#design-ff6347" title="Design">🎨</a></td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td align="center" size="13px" colspan="7">
        <img src="https://raw.githubusercontent.com/all-contributors/all-contributors-cli/1b8533af435da9854653492b1327a23a4dbd0a10/assets/logo-small.svg">
          <a href="https://all-contributors.js.org/docs/en/bot/usage">Add your contributions</a>
        </img>
      </td>
    </tr>
  </tfoot>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!