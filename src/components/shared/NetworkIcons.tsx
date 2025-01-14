import React from 'react'
import Image from 'next/image'
import { Tooltip } from 'antd'
import ethereumIcon from '@assets/network/ethereum.svg'
import optimismIcon from '@assets/network/optimist.svg'
import arbitrumIcon from '@assets/network/arbitrum.svg'
import polygonIcon from '@assets/network/polygon.svg'
import solanaIcon from '@assets/network/solana.svg'
import styled from 'styled-components'
import { Network } from '@/types/Product'

type NetworkIconProps = {
  network: Network
  size: number
  enabled?: boolean
}

export default function NetworkIcons({ network, size, enabled = true }: NetworkIconProps) {
  const networkIcons = {
    ethereum: ethereumIcon,
    optimism: optimismIcon,
    ['optimism-sepolia']: optimismIcon,
    arbitrum: arbitrumIcon,
    polygon: polygonIcon,
    solana: solanaIcon,
    holesky: ethereumIcon
  }

  return (
    <Tooltip title={network}>
      <NetworkIcon
        className={`${enabled ? '' : 'disabled'}`}
        src={networkIcons[network]}
        width={size}
        height={size}
        alt={network}
      />
    </Tooltip>
  )
}

const { NetworkIcon } = {
  NetworkIcon: styled(Image)`
    border-radius: 100%;
    box-shadow: ${({ theme }) => theme.shadow[100]};
    &.disabled {
      filter: grayscale(100%);
    }
  `
}
