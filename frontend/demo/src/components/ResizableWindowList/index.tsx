import React, {Component} from 'react';
import {VariableSizeList as List} from 'react-window';
import './index.module.scss';

type ResizableWindowProps = {
  itemCount: number;
  itemSize?: number | ((index: number) => number);
  width: string;
  children: React.ReactNode;
  onItemsRendered: (event: any) => void;
  infiniteLoaderRef: (ref: React.RefObject<List>) => void;
};

type ResizableWindowState = {
  height: number;
  mounted: boolean;
};

class ResizableWindowList extends Component<ResizableWindowProps, ResizableWindowState> {
  resizeRef: React.RefObject<HTMLDivElement>;
  listRef: React.MutableRefObject<List>;

  constructor(props) {
    super(props);
    this.resizeRef = React.createRef();
    this.listRef = React.createRef();
    this.state = {height: 200, mounted: true};
  }

  componentDidMount() {
    window.addEventListener('resize', this.resizeToFit);
    this.resizeToFit();
    setTimeout(this.resizeAfterStart, 500);
  }

  resizeAfterStart = () => {
    this.resizeRef.current ? this.resizeToFit() : setTimeout(this.resizeAfterStart, 500);
  };

  componentWillUnmount() {
    this.setState({mounted: false});
    window.removeEventListener('resize', this.resizeToFit);
  }

  resizeToFit = () => {
    if (this.state.mounted) {
      this.setState({
        height: Math.floor(this.resizeRef.current.getBoundingClientRect().height),
      });
    }
  };

  resetSizeCache = () => {
    this.listRef.current && this.listRef.current.resetAfterIndex(0, true);
  };

  setRef = ref => {
    this.props.infiniteLoaderRef(ref);
    this.listRef.current = ref;
  };

  render() {
    const {itemCount, itemSize, width, children, onItemsRendered} = this.props;
    return (
      <div ref={this.resizeRef} className="resizablewindowlist">
        <List
          ref={this.setRef}
          height={this.state.height}
          shouldResetStyleCacheOnItemSizeChange={true}
          itemCount={itemCount}
          onItemsRendered={onItemsRendered}
          itemSize={item => (typeof itemSize === 'function' ? itemSize(item) : itemSize)}
          width={width}>
          {children}
        </List>
      </div>
    );
  }
}

export default ResizableWindowList;
