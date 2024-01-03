export function cartridgeFileValidator(file) {
  const regex = /^\/cartridge\/(red|green|blue)\/([0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.(png|svg)$/;

  if (!regex.test(file.name)) {
    return {
      code: "invalid-structure",
      message: "File structure is invalid. It should be: /cartridge/[red, green, or blue]/[number 0 though 255].[.png, .svg]"
    };
  }

  return null;
}