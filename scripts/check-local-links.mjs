import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ignoredReference = /^(?:\/\/|https?:|mailto:|tel:|(?:https?:\/\/)?(?:www\.)?wa\.me(?:\/|$))/i;
const attributeValue = /(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/;

function getAttributeValue(match) {
  return match[1] ?? match[2] ?? match[3];
}

export function validateLocalLinks(html, rootDir) {
  const ids = new Set(
    [...html.matchAll(new RegExp(`\\bid\\s*=\\s*${attributeValue.source}`, 'gi'))]
      .map(getAttributeValue),
  );
  const references = [
    ...html.matchAll(new RegExp(`\\b(?:href|src)\\s*=\\s*${attributeValue.source}`, 'gi')),
  ].map((match) => getAttributeValue(match).trim());
  const optionalReferences = new Set(
    [...html.matchAll(/<[^>]*\bdata-optional-file\b[^>]*>|<[^>]*\b(?:href|src)\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'=<>`]+)[^>]*\bdata-optional-file\b[^>]*>/gi)]
      .flatMap(([tag]) => [...tag.matchAll(new RegExp(`\\b(?:href|src)\\s*=\\s*${attributeValue.source}`, 'gi'))])
      .map((match) => getAttributeValue(match).trim()),
  );
  const errors = [];

  for (const reference of references) {
    if (!reference || reference === '#' || ignoredReference.test(reference)) {
      continue;
    }

    const hashIndex = reference.indexOf('#');
    const anchor = hashIndex >= 0 ? reference.slice(hashIndex + 1) : '';
    if (anchor) {
      if (anchor && !ids.has(anchor)) {
        errors.push(`Missing anchor: #${anchor}`);
      }
    }

    const pathWithoutQueryOrHash = reference.slice(0, hashIndex >= 0 ? hashIndex : undefined).replace(/\?.*$/, '');
    if (pathWithoutQueryOrHash && !optionalReferences.has(reference) && !existsSync(resolve(rootDir, pathWithoutQueryOrHash))) {
      errors.push(`Missing local file: ${pathWithoutQueryOrHash}`);
    }
  }

  return errors;
}

export function runLocalLinkCheck(rootDir = process.cwd()) {
  const indexPath = resolve(rootDir, 'index.html');
  if (!existsSync(indexPath)) {
    const errors = ['Missing local file: index.html'];
    console.error(errors.join('\n'));
    process.exitCode = 1;
    return errors;
  }

  const errors = validateLocalLinks(readFileSync(indexPath, 'utf8'), rootDir);
  if (errors.length > 0) {
    console.error(errors.join('\n'));
    process.exitCode = 1;
    return errors;
  }

  console.log('Local links OK');
  return errors;
}

if (resolve(process.argv[1] ?? '') === fileURLToPath(import.meta.url)) {
  runLocalLinkCheck();
}
