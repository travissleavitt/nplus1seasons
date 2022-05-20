import React, { useEffect, useRef } from 'react';
import { uniqBy, flatten, sample } from 'lodash';
import { darken, lighten } from 'polished';
import { Network } from 'vis-network';
import useGetUserList from 'hooks/useGetUserList';
import userData from 'data/users';

const options = {
  nodes: {
    borderWidth: 4,
    color: {
      border: lighten(0.1, '#4e4e4e'),
      background: '#333',
    },
    font: {
      color: '#fff',
    },
    shape: 'circularImage',
    size: 32,
  },
  edges: {
    color: {
      color: sample(['#1900a0', '#38ff12', '#ff00e3', '#fff100', '#9600ff', '#00f5fb']),
    },
    width: 2,
  },
  physics: {
    forceAtlas2Based: {
      gravitationalConstant: -120,
      springLength: 400,
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
      {isLoading && <div className="loader">Please wait while we calculate the season...</div>}
      <div className="container" ref={ref} />
    </>
  );
};

export default NetworkGraph;
