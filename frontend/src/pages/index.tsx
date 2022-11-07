import AppPreviewImg from '../assets/app-preview.png';
import LogoImg from '../assets/logo.svg';
import Image from 'next/image';
import AvatarsUsersImg from '../assets/users-avatares-exemplo.png';
import IconCheckImg from '../assets/icon-check.svg';
import { api } from '../lib/axios';
import { FormEvent, useState } from 'react';


interface HomeProps {
  pollCount: number,
  guessCount: number,
  usersCount: number
}

export default function Home(props: HomeProps) {

  const [pollTitle, setPollTitle ] = useState(''); 

  console.log(pollTitle)

  async function createPoll(event: FormEvent){
    event.preventDefault();
    
    try {

      const response = await api.post('/polls', {
        title: pollTitle
      });

      const { code } = response.data;

      await navigator.clipboard.writeText(code);

      alert('Bolão criado com sucesso, o código do bolão foi copiado para a área de tranferência!');
      setPollTitle('');

    } catch (err) {
      console.log(err);
      alert('Falha ao criar o bolão, tente novamente!')
    }

  }

  return (
    <div className='max-w-[1224px] h-screen mx-auto grid grid-cols-2 gap-32 items-center'>
      <main>
        <Image src={LogoImg} alt="Logo da NLW - Copa" />

        <h1 className='mt-14 text-white text-5xl font-bold leading-tight'>
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>

        <div className='mt-10 flex items-center gap-2'>
          <Image src={AvatarsUsersImg} alt="" />
          <strong className='text-gray-100 text-xl'>
            <span className='text-ignite-500'>+{props.usersCount}</span> pessoas já estão usando
          </strong>
        </div>

        <form onSubmit={createPoll} className='mt-10 flex gap-2'>
          <input 
            className='flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100'
            type='text' 
            placeholder='Qual nome do seu bolão?' 
            value={pollTitle}
            onChange={event => setPollTitle(event.target.value)}
            required 
          />
          <button 
            className='bg-yellow-500 px-6 py-4 rounded text-gray-900 font-bold text-sm uppercase hover:bg-yellow-700' 
            type='submit'
          >
            Criar Meu Bolão
          </button>
        </form>

        <p className='mt-4 text-sm text-gray-300 leading-relaxed'>
          Após criar seu bolão, você receberá um código único que poderá usar para convidar outras pessoas 🚀
        </p>

        <div className='mt-10 pt-10 border-t border-x-gray-600 flex items-center justify-between text-gray-100'>
          <div className='flex items-center gap-6'>
            <Image src={IconCheckImg} alt="" />
            <div className='flex flex-col'>
              <span className='font-bold text-2xl'>+{props.pollCount}</span>
              <span>Bolões criados </span>
            </div>
          </div>

          <div className='w-px h-14 bg-gray-600' />

          <div className='flex items-center gap-6'>
            <Image src={IconCheckImg} alt="" />
            <div className='flex flex-col'>
              <span  className='font-bold text-2xl'>+{props.guessCount}</span>
              <span>Palpites enviados </span>
            </div>
          </div>
        </div>

      </main>

      <Image 
        src={AppPreviewImg} alt='Dois celulares exibindo o preview da página web do NLW-Copa' 
        quality={100}
      />

    </div>
    
  )
}


export const getServerSideProps = async () => {

  const [ 
    pollCountResponse, 
    guessesCountResponse, 
    usersCountResponse 
  ] = await Promise.all([
    api.get('/polls/count'),
    api.get('/guesses/count'),
    api.get('/users/count')
  ]);

  return {
    props: {
      pollCount: pollCountResponse.data.count,
      guessCount: guessesCountResponse.data.count,
      usersCount: usersCountResponse.data.count
    }
  }
}
