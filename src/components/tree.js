import React, { Component } from 'react';
import SortableTree, { toggleExpandedForAll } from 'react-sortable-tree';
import FileExplorerTheme from 'react-sortable-tree-theme-file-explorer';

import config from '../config';

class Tree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      treeData: []
    };
    // console.info(`constructor props: ${JSON.stringify(props)}, state: ${JSON.stringify(this.state)} `);
  }

  async componentDidMount() {
    // console.info(`config is ${JSON.stringify(config)}`);
    const response = await fetch(config.api);
    const treeData = await response.json();
    // console.info(`treeData is ${JSON.stringify(treeData)}`)
    this.setState({treeData: treeData});
  }

  updateTreeData = (treeData) => {
    this.setState({treeData});
    // console.info(`updateTreeData treeData: ${JSON.stringify(treeData)} `);
  }

  expand = (expanded) => {
    this.setState({
      treeData: toggleExpandedForAll({
        expanded,
      }),
    });
  }

  expandAll = () => {
    this.expand(true);
  }

  collapseAll = () => {
    this.expand(false);
  }

  onLeafNodeClickDefault = node => {
    global.alert(`clicked ${JSON.stringify(node)}`);
  }

  render() {
    const {
      onLeafNodeClick
    } = this.props;

    const alertNodeInfo = ({ node, path, treeIndex }) => {
      const objectString = Object.keys(node)
        .map(k => (k === 'children' ? 'children: Array' : `${k}: '${node[k]}'`))
        .join(',\n   ');

      global.alert(
        'Info passed to the icon and button generators:\n\n' +
          `node: {\n   ${objectString}\n},\n` +
          `path: [${path.join(', ')}],\n` +
          `treeIndex: ${treeIndex}`
      );
    };

    return (
        <div style={{ flex: '1 0 50%', padding: '15px 0', height: '100vh' }}>
          <SortableTree
            theme={FileExplorerTheme}
            treeData={this.state.treeData}
            onChange={this.updateTreeData}
            canDrag={() => false}
            canDrop={() => false}
            generateNodeProps={rowInfo => ({
              icons: rowInfo.node.isDirectory
                ? [
                    <div
                      style={{
                        borderLeft: 'solid 8px gray',
                        borderBottom: 'solid 10px gray',
                        marginRight: 10,
                        width: 16,
                        height: 12,
                        filter: rowInfo.node.expanded
                          ? 'drop-shadow(1px 0 0 gray) drop-shadow(0 1px 0 gray) drop-shadow(0 -1px 0 gray) drop-shadow(-1px 0 0 gray)'
                          : 'none',
                        borderColor: rowInfo.node.expanded ? 'white' : 'gray',
                      }}
                    />,
                  ]
                : [
                    <div
                      style={{
                        border: 'solid 1px black',
                        fontSize: 8,
                        textAlign: 'center',
                        marginRight: 10,
                        width: 12,
                        height: 16,
                      }}
                    >
                      F
                    </div>,
                  ],
                  buttons: [
                    <button
                      style={{
                        padding: 0,
                        borderRadius: '100%',
                        backgroundColor: 'gray',
                        color: 'white',
                        width: 16,
                        height: 16,
                        border: 0,
                        fontWeight: 100,
                      }}
                      onClick={() => alertNodeInfo(rowInfo)}
                    >
                      i
                    </button>,
                  ],
                  title: ({node, path, treeIndex}) => {
                    return (
                      <span>
                      {node.isDirectory ? (
                        node.title
                      ) : (
                        <span onClick={() => onLeafNodeClick(rowInfo)}>{node.title}</span>
                      )}
                      </span>
                    );
                  }
            })}
          />
        </div>
    );
  }
}

export default Tree;