#!/bin/bash
# After publishing: is the live site exactly the files in docs/, with nothing added?
#
#     scripts/check-live.sh
#
# It asks stonefoldlabs.com for each page and nothing else. It changes nothing.

set -u
cd "$(dirname "$0")/.."

SITE="https://stonefoldlabs.com"
failed=0
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

say_bad() { echo "NOT OK  $1"; failed=1; }
say_ok() { echo "ok      $1"; }

# 1. Every published file is byte-for-byte the local one, and comes with no cookie.
while IFS= read -r file; do
  path="/${file#docs/}"
  case "$path" in
    /CNAME|/.nojekyll) continue ;;
  esac
  url="$SITE${path%index.html}"
  if ! curl -sS --max-time 20 -D "$tmp/headers" -o "$tmp/body" "$url"; then
    say_bad "$url: no answer"
    continue
  fi
  status="$(head -1 "$tmp/headers" | tr -d '\r')"
  case "$path" in
    /404.html) ;;
    *) case "$status" in *" 200"*) ;; *) say_bad "$url: $status" ;; esac ;;
  esac
  if cmp -s "$tmp/body" "$file"; then
    say_ok "$url is exactly $file"
  else
    say_bad "$url differs from $file (something was added or the push hasn't landed)"
  fi
  if grep -qi '^set-cookie:' "$tmp/headers"; then
    say_bad "$url sets a cookie"
  fi
done < <(find docs -type f ! -name '.DS_Store' | sort)

# 2. A page that doesn't exist gets the 404 page.
code="$(curl -sS --max-time 20 -o "$tmp/missing" -w '%{http_code}' "$SITE/no-such-page-$$")"
if [ "$code" = "404" ] && cmp -s "$tmp/missing" docs/404.html; then
  say_ok "a missing page gets 404.html"
else
  say_bad "a missing page answered $code, or not with 404.html"
fi

# 3. Plain http and www both end at https://stonefoldlabs.com/.
for start in "http://stonefoldlabs.com/" "http://www.stonefoldlabs.com/" "https://www.stonefoldlabs.com/"; do
  end="$(curl -sS --max-time 20 -L -o /dev/null -w '%{url_effective}' "$start")"
  if [ "$end" = "$SITE/" ]; then
    say_ok "$start ends at $SITE/"
  else
    say_bad "$start ends at ${end:-nothing}"
  fi
done

echo
if [ "$failed" = 0 ]; then
  echo "The live site matches docs/ and sets no cookies."
else
  echo "Something is off. See the lines marked NOT OK."
fi
exit "$failed"
