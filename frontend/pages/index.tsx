import React, { useEffect, useState } from "https://esm.sh/react@17.0.2";
import styled from "https://esm.sh/styled-components";

import config from "../back/config/config.ts";
import { IBlock } from "../back/blocks/index.ts";

import { Container } from "../components/Container.ts";
import { Content } from "../components/Content.ts";
import { BlockContainer, Block } from "../components/Block.tsx";
import { Donation } from "../components/Donation.tsx";
import SiteTitle from "../components/SiteTitle.tsx";
import { useStoreState } from "../state/index.ts";

const DescriptionBlock = styled.div`
  max-width: 600px;
  margin: auto;
`;

const Text = styled.p`
  color: #f7f7f7;
  /* text-shadow: #000 2px 2px 0px; */
  font-size: 16px;
  text-align: center;
`;

const TopSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CurrentPeriod = styled.h2`
  font-size: 24px;
  margin-bottom: 10px;
  color: #ff9b20;
  text-shadow: #000 2px 2px 0px;
`;

const LockinInfo = styled.h2`
  font-size: 16px;
  margin-bottom: 10px;
  color: #ff9b20;
  text-shadow: #000 2px 2px 0px;
`;

const BootstrappingInProgress = styled.p`
  color: #efefef;
  text-align: center;
`;

export default function Blocks() {
  const blocks = useStoreState((store) => store.blocks);

  const forkName = config.fork.name;

  const treshhold = config.fork.threshold;
  const currentNumberOfSignallingBlocks = blocks.reduce(
    (prev, currentBlock) => prev + +(currentBlock.signals ?? false),
    0
  );
  const blocksLeftForActivation = treshhold - currentNumberOfSignallingBlocks;
  const lockedIn = currentNumberOfSignallingBlocks >= treshhold;
  const blocksLeftInThisPeriod = blocks.reduce((prev, currentBlock) => prev + +(currentBlock.signals === undefined), 0);
  const currentPeriodFailed = blocksLeftForActivation > blocksLeftInThisPeriod;

  return (
    <Container>
      <head>
        <title>{forkName} activation</title>
      </head>
      <Content>
        <SiteTitle />
        <DescriptionBlock>
          {config.fork.info.map((text, index) => (
            <Text key={index}>{text}</Text>
          ))}
        </DescriptionBlock>
        <TopSection>
          <CurrentPeriod>Current signalling period of 2016 blocks</CurrentPeriod>
          <LockinInfo>
            {!lockedIn && (
              <>
                {blocksLeftForActivation} {forkName} blocks left until softfork is locked in.
                <br />
                {!currentPeriodFailed && <>90% of the blocks within the period has to signal.</>}
                {currentPeriodFailed && (
                  <>
                    {forkName} cannot be locked in within this period
                    <br />
                    (90% of the blocks has to signal).
                  </>
                )}
              </>
            )}
            {lockedIn && <>{forkName.toUpperCase()} IS LOCKED IN FOR DEPLOYMENT!</>}
          </LockinInfo>
        </TopSection>
        <BlockContainer>
          {blocks.length === 0 && (
            <BootstrappingInProgress>
              Server is currently loading blocks, please try soon again.
            </BootstrappingInProgress>
          )}
          {blocks.map((block, i) => (
            <Block key={i} height={block.height} signals={block.signals} miner={block.miner} />
          ))}
        </BlockContainer>
        {config.donation && <Donation />}
      </Content>
    </Container>
  );
}
