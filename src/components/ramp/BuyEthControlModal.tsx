import Modal from '@/components/shared/Modal'

import useLocaleTranslation from '@/hooks/useLocaleTranslation'
import { useReactiveVar } from '@apollo/client'

import { globalConfig } from '@/config/global'
import useEthBalanceOf from '@/hooks/contracts/useEthBalanceOf'
import {
  BrlaBuyEthStep,
  changeWalletAddress,
  clearModal,
  openBrlaModalVar,
  stepsControlBuyCryptoVar
} from '@/hooks/ramp/useControlModal'
import axios from 'axios'
import { useEffect } from 'react'
import { SWRConfig } from 'swr'
import { useAccount } from 'wagmi'
import { StakingProduct } from '../../types/Product'
import ConnectWallet from '../shared/ConnectWallet'
import CheckoutStep from './CheckoutStep'
import GenericErrorComponent from './GenericErrorComponent'
import KycStep from './KycStep'
import PaymentMethod from './PaymentMethod'
import ProcessingCheckoutStep from './ProcessingCheckoutStep'
import ProcessingKycStep from './ProcessingKycStep'
import QuotationStep from './QuotationStep'
import SuccessStep from './SuccessStep'
import { TimeOutCheckout } from './TimeOutCheckout'

export default function BuyEthControlModal({ stakingProduct }: { stakingProduct: StakingProduct }) {
  const { t } = useLocaleTranslation()
  const { address } = useAccount()
  const { refetch } = useEthBalanceOf({ walletAddress: address, chainId: 1 })

  const steps = {
    MethodPayment: <PaymentMethod />,
    Quotation: <QuotationStep />,
    Kyc: <KycStep />,
    ConnectWallet: <ConnectWallet useModal />,
    ProcessingKyc: <ProcessingKycStep />,
    ProcessingCheckoutStep: <ProcessingCheckoutStep />,
    Checkout: <CheckoutStep />,
    TimeOutCheckout: <TimeOutCheckout stakingProduct={stakingProduct} />,
    Success: <SuccessStep />,
    error: <GenericErrorComponent />
  }

  const controlModal = useReactiveVar(openBrlaModalVar)
  const currentStep = useReactiveVar(stepsControlBuyCryptoVar)
  const titleList: { [key: string]: string } = {
    Success: t('v2.ramp.success'),
    MethodPayment: t('v2.ramp.provider')
  }
  const title = currentStep in titleList ? titleList[currentStep] : t('v2.ramp.title')
  const { backendUrl } = globalConfig

  useEffect(() => {
    if (address && currentStep === BrlaBuyEthStep.ConnectWallet) {
      stepsControlBuyCryptoVar(BrlaBuyEthStep.ProcessingKyc)
      return
    }

    if (address && currentStep === BrlaBuyEthStep.Success) {
      refetch()
      return
    }
  }, [address, currentStep, refetch])

  useEffect(() => {
    if (address) {
      changeWalletAddress()
    }
  }, [address])

  return (
    <SWRConfig
      value={{
        refreshInterval: 0,
        revalidateOnMount: true,
        revalidateIfStale: true,
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
        errorRetryCount: 100,
        shouldRetryOnError: true,
        fetcher: (uri: string) =>
          axios.get(`${backendUrl}/${uri}`).then(res => {
            return res.data
          })
      }}
    >
      <Modal
        className={currentStep.toLowerCase()}
        title={title}
        isOpen={controlModal}
        onClose={clearModal}
        width={'auto'}
        showCloseIcon={currentStep !== BrlaBuyEthStep.Success}
        noPadding={currentStep === BrlaBuyEthStep.Kyc || currentStep === BrlaBuyEthStep.Checkout}
        showHeader={![BrlaBuyEthStep.TimeOutCheckout, BrlaBuyEthStep.Error].includes(currentStep)}
      >
        {steps[currentStep]}
      </Modal>
    </SWRConfig>
  )
}
