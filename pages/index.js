import React from 'react'
import Head from 'next/head'
import Hero from '../static/hero.svg'

export default function Home () {
  return (
    <div className='container'>
      <Head>
        <title>Lucas Gonzalo Michailian</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main>
        <div>
          <h1 className='title'>Lucas Gonzalo Michailian</h1>
          <p className='description'>DEVELOPER AKA MAGICIAN</p>
        </div>
        <div
          style={{
            width: '200px',
            height: '200px',
            backgroundImage: `url(${Hero})`,
            backgroundSize: 'cover'
          }}
        />
      </main>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }

        .title {
          font-weight: 600;
          font-size: 60px;
          margin-bottom: 0;
          width: 418px;
        }

        .container {
          height: 100vh;
          width: 1024px;
          margin: 0 auto;
          display: flex;
          align-items: center;
        }
      `}</style>
    </div>
  )
}
