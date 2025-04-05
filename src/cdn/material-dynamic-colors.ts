import { IMaterialDynamicColorsTheme } from "./interfaces";
import { themeFromImage, hexFromArgb, Theme } from "@material/material-color-utilities";

const themeToJson = (theme: Theme) => {
  let json = JSON.parse(JSON.stringify(theme.schemes));

  for(let i in json)
    for (let j in json[i])
      json[i][j] = hexFromArgb(json[i][j]);

  json.dark.surfaceDim = hexFromArgb(theme.palettes.neutral.tone(6));
  json.dark.surface = hexFromArgb(theme.palettes.neutral.tone(6));
  json.dark.surfaceBright = hexFromArgb(theme.palettes.neutral.tone(24));
  json.dark.surfaceContainerLowest = hexFromArgb(theme.palettes.neutral.tone(4));
  json.dark.surfaceContainerLow = hexFromArgb(theme.palettes.neutral.tone(10));
  json.dark.surfaceContainer = hexFromArgb(theme.palettes.neutral.tone(12));
  json.dark.surfaceContainerHigh = hexFromArgb(theme.palettes.neutral.tone(17));
  json.dark.surfaceContainerHighest = hexFromArgb(theme.palettes.neutral.tone(22));
  json.dark.onSurface = hexFromArgb(theme.palettes.neutral.tone(90));
  json.dark.onSurfaceVariant = hexFromArgb(theme.palettes.neutralVariant.tone(80));
  json.dark.outline = hexFromArgb(theme.palettes.neutralVariant.tone(60));
  json.dark.outlineVariant = hexFromArgb(theme.palettes.neutralVariant.tone(30));

  return json;
}

const materialDynamicColors = async (from: Blob): Promise<IMaterialDynamicColorsTheme> => {
  const to:any = from;
  const emptyTheme = <IMaterialDynamicColorsTheme>{
    dark:{}
  }

  try {
    let blob = new Blob();
    if (to.size) blob = to;
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