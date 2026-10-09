declare module 'react-game-engine' {
  import React from 'react';

  export interface GameEngineProps {
    systems?: any[];
    entities?: any;
    renderer?: any;
    touchProcessor?: any;
    timer?: any;
    running?: boolean;
    onEvent?: (e: any) => void;
    style?: React.CSSProperties;
    className?: string;
    children?: React.ReactNode;
  }

  export class GameEngine extends React.Component<GameEngineProps> {}
}
