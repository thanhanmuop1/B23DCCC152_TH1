import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card } from 'antd';
import RockPaperScissors from '@/components/RockPaperScissors';

const RockPaperScissorsPage: React.FC = () => {
  return (
    <PageContainer
      header={{
        title: 'Oẳn Tù Tì',
        subTitle: 'Trò chơi Kéo, Búa, Bao',
      }}
    >
      <Card>
        <RockPaperScissors />
      </Card>
    </PageContainer>
  );
};

export default RockPaperScissorsPage; 