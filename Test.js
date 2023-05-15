const { Controller, Tag } = require("ethernet-ip");

// Intantiate Controller
const PLC = new Controller();

// Subscribe to Tags
PLC.subscribe(new Tag("LT51608LC_PV.Out_Value"));
PLC.subscribe(new Tag("TT51683.Out_Value"));
PLC.subscribe(new Tag("LT51508LC_PV.Out_Value"));
PLC.subscribe(new Tag("TT51583.Out_Value"));

// Connect to PLC at IP, SLOT
PLC.connect("10.184.170.52", 1).then(() => {
  const { name } = PLC.properties;

  // Log Connected to Console
  console.log(`\n\nConnected to PLC ${name}...\n`);

  // Begin Scanning Subscription Group
  PLC.scan();
});

// Initialize Event Handlers
PLC.forEach((tag) => {
  tag.on("Changed", (tag, lastValue) => {
    console.log(`${tag.name} changed from ${lastValue} -> ${tag.value}`);
  });
});
