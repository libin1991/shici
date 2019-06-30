import Card from './Card'

function QR () {
  return (
    <Card>
      <style jsx>{`
      .cunyin {
        padding: 30px 0;
        background-color: #fff;
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .cunyin span {
        margin-top: 10px; 
      }
    `}</style>
      <div className="cunyin">
        <img src="/static/wechat.jpg" width="180px" height="180px" />
        <span>每天一首古诗词</span>
      </div>
    </Card>
  )
}

export default QR
