import { SquareType } from "./types";
export function getColor({ checkPoint, player, wall }: SquareType): string {
  if (checkPoint) return "#8888cf";
  if (player) return "#810000";
  if (wall) return "#080808";

  return "#B2AFAF";
}
