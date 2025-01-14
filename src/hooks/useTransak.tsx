import { Transak, TransakConfig } from '@transak/transak-sdk'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { useTheme } from 'styled-components'
import useConnectedAccount from './useConnectedAccount'
import useLocaleTranslation from './useLocaleTranslation'

type TransakProps = {
  onSuccess?: () => void
  productsAvailed: 'BUY' | 'SELL'
}

export default function useTransak(config?: TransakProps) {
  const { t } = useLocaleTranslation()
  const theme = useTheme()
  const [isClosed, setIsClosed] = useState(false)
  const defaultTransakConfig: TransakConfig = useMemo(
    () => ({
      apiKey: process.env.NEXT_PUBLIC_TRANSAK_API_KEY as string,
      environment: Transak.ENVIRONMENTS.PRODUCTION,
      network: 'ethereum',
      exchangeScreenTitle: config?.productsAvailed === 'SELL' ? t('sellCryptoTitle') : t('buyCryptoTitle'),
      defaultNetwork: 'ethereum',
      colorMode: 'LIGHT',
      themeColor: theme.colorV2.blue[1],
      productsAvailed: config?.productsAvailed,
      hideMenu: true,
      cryptoCurrencyList: 'ETH'
    }),
    [config?.productsAvailed, t, theme.colorV2.blue]
  )

  const [transakConfig, setTransakConfig] = useState<TransakConfig>(defaultTransakConfig)
  const [transak, setTransak] = useState(new Transak(transakConfig))

  const { web3AuthUserInfo, account } = useConnectedAccount()
  const { locale } = useRouter()

  useEffect(() => {
    const newTransakConfig: TransakConfig = {
      ...defaultTransakConfig,
      defaultFiatCurrency: locale === 'pt' ? 'BRL' : 'USD',
      disableWalletAddressForm: account ? true : false,
      walletAddress: account || undefined,
      email: web3AuthUserInfo?.email || undefined
    }
    setTransakConfig(newTransakConfig)
  }, [account, defaultTransakConfig, locale, web3AuthUserInfo?.email])

  useEffect(() => {
    setTransak(new Transak(transakConfig))
  }, [transakConfig])

  useEffect(() => {
    Transak.on(Transak.EVENTS.TRANSAK_WIDGET_CLOSE, () => {
      setIsClosed(true)
    })
    Transak.on(Transak.EVENTS.TRANSAK_WIDGET_INITIALISED, () => {
      setIsClosed(false)
    })

    Transak.on(Transak.EVENTS.TRANSAK_ORDER_CREATED, orderData => {
      console.log(orderData)
    })

    Transak.on(Transak.EVENTS.TRANSAK_ORDER_SUCCESSFUL, orderData => {
      console.log(orderData)
      config && config.onSuccess && config.onSuccess()
      transak.close()
    })

    return () => {
      transak.close()
    }
  }, [config, transak, transakConfig])

  const onInit = () => {
    transak.init()
  }

  const onClose = () => {
    transak.close()
  }
  return { transak, onInit, onClose, isClosed }
}
