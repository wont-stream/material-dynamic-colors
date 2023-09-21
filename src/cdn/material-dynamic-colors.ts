import { IMaterialDynamicColorsTheme } from "./interfaces";
import { themeFromSourceColor, themeFromImage, argbFromHex, hexFromArgb, Theme } from "@material/material-color-utilities";

function themeToJson(theme: Theme) {
  let json = JSON.parse(JSON.stringify(theme.schemes));

  for(let i in json)
    for (let j in json[i])
      json[i][j] = hexFromArgb(json[i][j]);

  json.dark.surfaceDim = hexFromArgb(theme.palettes.neutral.tone(6));
  json.dark.surfaceBright = hexFromArgb(theme.palettes.neutral.tone(24));
  json.dark.surfaceContainerLowest = hexFromArgb(theme.palettes.neutral.tone(4));
  json.dark.surfaceContainerLow = hexFromArgb(theme.palettes.neutral.tone(10));
  json.dark.surfaceContainer = hexFromArgb(theme.palettes.neutral.tone(12));
  json.dark.surfaceContainerHight = hexFromArgb(theme.palettes.neutral.tone(17));
  json.dark.surfaceContainerHighest = hexFromArgb(theme.palettes.neutral.tone(22));
  json.light.surfaceDim = hexFromArgb(theme.palettes.neutral.tone(87));
  json.light.surfaceBright = hexFromArgb(theme.palettes.neutral.tone(98));
  json.light.surfaceContainerLowest = hexFromArgb(theme.palettes.neutral.tone(100));
  json.light.surfaceContainerLow = hexFromArgb(theme.palettes.neutral.tone(96));
  json.light.surfaceContainer = hexFromArgb(theme.palettes.neutral.tone(94));
  json.light.surfaceContainerHight = hexFromArgb(theme.palettes.neutral.tone(92));
  json.light.surfaceContainerHighest = hexFromArgb(theme.palettes.neutral.tone(90));

  return json;
}

async function materialDynamicColors (from: string | File | Blob | Event | HTMLImageElement): Promise<IMaterialDynamicColorsTheme> {
  const to:any = from;
  const emptyTheme = <IMaterialDynamicColorsTheme>{
    light:{},
    dark:{}
  }

  try {
    if (typeof to === "string" && /^\#[0-9a-f]+$/i.test(to)) {
      let theme = themeFromSourceColor(argbFromHex(to));
      return themeToJson(theme);
    }
  
    if (to.src) {
      let theme = await themeFromImage(to);
      return themeToJson(theme);
    }

    let blob = new Blob();
    if (typeof to === "string") blob = await fetch(to).then(response => response.blob());
    if (to.size) blob = to;
    if (to.files && to.files[0]) blob = to.files[0];
    if (to.target && to.target.files && to.target.files[0]) blob = to.target.files[0];
    if (!blob.size) return emptyTheme;
  
    let image = new Image(64);
    image.src = URL.createObjectURL(blob);
    
    let theme = await themeFromImage(image);
    return themeToJson(theme);
  } catch(error) {
    return emptyTheme;
  }
}

(globalThis as any).materialDynamicColors = materialDynamicColors;
export default (globalThis as any).materialDynamicColors;