#!/bin/bash

echo "dev-script(): $1"

# Apply consts and vars.
TU_GIT="UPDATE_UPSTREAM_X1_LOCK"
PWD=$(pwd)
BN_PWD=$(basename $PWD)

# Abort if run in template to protect branch.
if [[ "$BN_PWD" == "TemplateAllLang" ]]; then
  echo "dev-script(): Unable to apply 'TemplateAllLang' to itself. Exiting..."
  exit 1
fi
echo "dev-script(): Applying Upstream 'TemplateAllLang' Update"

# Delete failed sync attempt(s) and initialize template locally.
rm -rf "./$TU_GIT"
git clone --quiet https://github.com/xCykrix/TemplateAllLang "$TU_GIT" > /dev/null

# Move Template Files
cp -rf "./$TU_GIT/.github/" "."
cp -rf "./$TU_GIT/dev/" "."
cp -rf "./$TU_GIT/.editorconfig" "."
cp -rf "./$TU_GIT/.gitignore" "."
cp -rf "./$TU_GIT/LICENSE" "."
cp -rf "./$TU_GIT/make.sh" "."

# Generate Base Files
mkdir -p "./dev/"
touch "./dev/0.setup.sh"
touch "./dev/1.build.sh"
touch "./dev/2.validate.sh"

# Delete Template
rm -rf "./$TU_GIT"

exit 0
