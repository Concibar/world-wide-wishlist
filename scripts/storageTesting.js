async function saveTesting(size) {
  console.log("saveTesting function is connected");
  chrome.storage.local.set({'wishes': ["test", "foo", "bar"]});

  for (let i = 0; i < size; i++) {
    let formData = getFormData(i);
    let wish = new Wish(formData);
    await wish.save();
  };

  console.log("saving done, saving one more wish");

  let startTime = Date.now();
  let formData = getFormData(size);
  let wish = new Wish(formData);
  await wish.save();
  let stopTime = Date.now();
  let saveTime = (stopTime - startTime) / 1000;
  console.log(`saving the ${size}th wish took ${saveTime} seconds`);
};
