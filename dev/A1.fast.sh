
ALL_SCRIPTS=(
  "B1.build"
  "B2.validate"
)

for SCRIPT in ${ALL_SCRIPTS[@]}; do
  echo "chain-script(): '$SCRIPT';";
  bash make.sh $SCRIPT;
  EXIT_CODE_L=$?
  if [[ "$EXIT_CODE_L" -ne 0 ]]; then
    echo "chain-script(): Aborting due to '$SCRIPT' failing to execute.";
    exit $EXIT_CODE_L;
  fi
done
