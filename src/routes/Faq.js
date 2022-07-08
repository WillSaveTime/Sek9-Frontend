import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import styled from '@emotion/styled/macro'
import mq from '../mediaQuery'

import { H2 as DefaultH2, Title } from '../components/Typography/Basic'
import Anchor from '../components/Icons/Anchor'
import slugify from 'slugify'
import ReverseRecordImageSrc from '../assets/reverseRecordImage.png'
import {
  NonMainPageBannerContainer,
  DAOBannerContent
} from '../components/Banner/DAOBanner'

const H2 = styled(DefaultH2)`
  margin-top: 50px;
  margin-left: 20px;
  ${mq.medium`
    margin-left: 0;
  `}
`

const Question = styled('h3')`
  font-size: 15px;
  margin-right: 0.5em;
  display: inline;
`

const Answer = styled('p')``

const AnchorContainer = styled('a')``

const ImageContainer = styled('div')`
  margin: 2em;
`

const ReverseRecordImage = styled('img')`
  width: 100%;
  ${mq.medium`
    width: 600px;
  `}
`

const Section = ({ question, children }) => {
  let slug
  if (question) {
    slug = slugify(question, {
      lower: true
    })
  }
  return (
    <>
      {question && (
        <>
          {' '}
          <Question id={slug}>{question}</Question>
          <AnchorContainer href={`#${slug}`}>
            <Anchor />
          </AnchorContainer>
        </>
      )}
      <Answer>{children}</Answer>
    </>
  )
}

function Faq() {
  const { t } = useTranslation()
  return (
    <>
      {/* <NonMainPageBannerContainer>
        <DAOBannerContent />
      </NonMainPageBannerContainer> */}
      <FaqContainer>
        <Title>FAQ</Title>
        <H2>1. Bulk Registration</H2>
        <Section question="Gas savings:">
          Bulk Registration currently saves around 30% gas usage over the ENS
          dApp.
        </Section>

        <Section question="How:">
          Our bulk register contract is using the ENS contract function
          register() and not registerWithConfig() that the ENS dApp uses by
          default to mint names. registerWithConfig() sets the default resolver
          for a name in the same transaction. register() does not set the
          default resolver for a name in the same transaction.
        </Section>

        <Section question="Meaning:">
          The default resolver is what links your eth address to the name for
          receiving payments, nfts, as well as setting the TEXT records of an
          ENS name. Such as content, URL, avatar, and email records for a given
          name. You still own the name however and are the owner of the actual
          token itself. By not setting the default resolver we save 30% in gas
          cost but also can not set the records mentioned above (content, URL,
          avatar, email, etc) and can not receive eth or other payments sent to
          the name. It is strictly "owned" by the buyer, who can now resell the
          name on markets such as opensea, looksrare, x2y2. The same as they
          would if they purchased a name from the ENS dApp.
        </Section>

        <Section question="Fee:">
          10% fee of the total of all names is charged as a fee for ens.vision
          to continue to provide support and new features.
          <br />
          (GAS usage with ENS dApp for one name: 257,858 // GAS usage with ENS
          Vision dApp for one name: 203,159)
          <br />
          Transaction stuck on "pending": If your transaction was successfully
          confirmed but ens.vision is still showing "Commit/Register Tx pending"
          it is safe to refresh (F5) ens.vision without you losing the cart or
          the transaction state. This will in most cases clear the pending state
          and resolve the issue.
        </Section>
        <H2>2. WARNING: Contains non-ASCII characters</H2>

        <Section>
          Please be aware that there are characters that look identical or very
          similar to English letters, especially characters from Cyrillic and
          Greek. Also, traditional Chinese characters can look identical or very
          similar to simplified variants. [See here for more
          information.](https://en.wikipedia.org/wiki/IDN_homograph_attack)
        </Section>
      </FaqContainer>
    </>
  )
}

const FaqContainer = styled('div')`
  margin: 1em;
  padding: 20px 40px;
  background-color: white;
`

export default Faq
