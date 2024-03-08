
export type SquareType = {
    x: number;
    y: number;
    size: number;
    player: boolean;
    wall: boolean;
    checkPoint: boolean;
    moved: boolean;
  };

export type path = {i:number,j:number}[]

export type lastPath  = { foundPath: boolean; path: path }