import { config } from '@/config/wagmi'
import useLocaleTranslation from '@/hooks/useLocaleTranslation'
import useWalletProviderImage from '@/hooks/useWalletProviderImage'
import Image from 'next/image'
import { useState } from 'react'
import styled from 'styled-components'
import { useConnect } from 'wagmi'

type ConnectWalletProps = {
  useModal?: boolean
}

export default function ConnectWallet({ useModal: isCreateProject }: ConnectWalletProps) {
  const [hasAgreeTerms, setHasAgreeTerms] = useState(false)

  const { connect, connectors } = useConnect({
    config
  })

  const { t } = useLocaleTranslation()

  const handleConnectorImage = useWalletProviderImage()

  function handleTermsAndConditionsExternalLink() {
    return 'https://university.staketogether.org/en/articles/8646463-terms-and-conditions'
  }

  function handlePrivacyPolicyExternalLink() {
    return 'https://university.staketogether.org/en/articles/8646517-privacy-policy'
  }

  const handleConnectorIndex = (index: number) => {
    const web3Auth: { [key: number]: string } = {
      0: 'Google',
      1: 'Facebook',
      2: 'Apple'
    }
    return web3Auth[index]
  }

  return (
    <Container>
      <Terms>
        <input
          type='checkbox'
          name='agree'
          checked={hasAgreeTerms}
          onChange={e => setHasAgreeTerms(e.target.checked)}
        />
        <span>
          {t('v2.sidebar.disconnected.iAgreeToThe')}
          <a href={handleTermsAndConditionsExternalLink()} target='_blank'>
            {' '}
            {t('v2.sidebar.disconnected.terms&conditions')}{' '}
          </a>
          {t('v2.sidebar.disconnected.and')}
          <a href={handlePrivacyPolicyExternalLink()} target='_blank'>
            {' '}
            {t('v2.sidebar.disconnected.privacyPolicy')}
          </a>
        </span>
      </Terms>
      <ContainerWalletConnect className={`${isCreateProject && 'useModal'}`}>
        {connectors.map((connector, index) => {
          const walletName = connector.id === 'web3auth' ? handleConnectorIndex(index) : connector.name
          return (
            <div
              key={connector.id + index}
              className={`${hasAgreeTerms ? '' : 'disabled'}`}
              onClick={() => hasAgreeTerms && connect({ connector })}
            >
              {connector.icon ? (
                <Image src={connector.icon} alt={connector.name} width={24} height={24} objectFit='fill' />
              ) : (
                handleConnectorImage(walletName)
              )}

              {walletName}
            </div>
          )
        })}
      </ContainerWalletConnect>
    </Container>
  )
}

const { Container, ContainerWalletConnect, Terms } = {
  Container: styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.size[16]};
  `,
  ContainerWalletConnect: styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.size[8]};

    &.useModal {
      div {
        background: ${({ theme }) => theme.colorV2.gray[2]};
        &:hover {
          background: #e4e4e4;
        }
      }
    }
    div {
      cursor: pointer;
      width: 100%;
      display: flex;
      align-items: center;
      gap: ${({ theme }) => theme.size[16]};
      padding: ${({ theme }) => theme.size[8]};
      background: ${({ theme }) => theme.colorV2.white};
      box-shadow: ${({ theme }) => theme.shadow[100]};
      border-radius: ${({ theme }) => theme.size[8]};
      font-size: 14px;

      &:hover {
        background: ${({ theme }) => theme.color.whiteAlpha[600]};
      }

      img {
        border-radius: 100%;
        box-shadow: ${({ theme }) => theme.shadow[100]};
      }

      &.disabled {
        img {
          filter: grayscale(100%);
        }
        cursor: not-allowed;
        color: ${({ theme }) => theme.color.blackAlpha[600]};
        background: ${({ theme }) => theme.color.blackAlpha[100]};
      }
    }
  `,
  Terms: styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.size[8]};

    font-size: ${({ theme }) => theme.font.size[12]};
    font-weight: 500;

    a {
      color: ${({ theme }) => theme.color.primary};
      &:hover {
        color: ${({ theme }) => theme.color.secondary};
      }
    }

    > input {
      cursor: pointer;
    }
  `
}
