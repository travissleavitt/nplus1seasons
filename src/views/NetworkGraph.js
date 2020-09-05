import React, { useEffect, useRef } from 'react';
import { uniqBy, flatten } from 'lodash';
import { darken } from 'polished';
import { Network } from 'vis-network';
import useGetUserList from 'hooks/useGetUserList';
import userData from 'data/users';
import styles from './NetworkGraph.module.scss';

const options = {
  nodes: {
    borderWidth: 8,
    color: {
      border: darken(0.1, '#39464e'),
      background: '#666666',
    },
    font: {
      color: '#fff',
    },
    shape: 'circularImage',
    size: 32,
  },
  edges: {
    color: {
      color: '#bbb',
    },
    width: 2,
  },
  physics: {
    forceAtlas2Based: {
      gravitationalConstant: -120,
      centralGravity: 0.01,
      springLength: 300,
      springConstant: 0.18,
    },
    maxVelocity: 146,
    solver: 'forceAtlas2Based',
    timestep: 0.35,
    stabilization: { iterations: 250 },
  },
};

const NetworkGraph = () => {
  const ref = useRef();
  const { users, isLoading } = useGetUserList();

  useEffect(() => {
    if (users.length) {
      const nodes = users.map((user) => ({
        id: user.id,
        title: user.profile.real_name,
        image: user.profile.image_72,
      }));
      const edges = uniqBy(
        flatten(
          Object.keys(userData).map((slackId, user) =>
            userData[slackId].friends.map((friendSlackId) => ({
              from: slackId,
              to: friendSlackId,
              id: [slackId, friendSlackId].sort().join(''),
            }))
          )
        ),
        'id'
      );

      new Network(ref.current, { nodes, edges }, options);
    }
  }, [users]);

  return (
    <>
      {isLoading && (
        <div className={styles.loader}>Please wait while we calculate the season...</div>
      )}
      <div className={styles.container} ref={ref} />
    </>
  );
};

export default NetworkGraph;
