import json
import sys

from funcy import distinct, filter, first, identity
from io import TextIOWrapper


# プレイヤーのサンプル（性格：大胆）
class BoldPlayer:
    # ゲームを開始します。
    def begin_game(self, playerIndex):
        print('1-999 ver 0.0', file=sys.stderr)  # 標準出力は通信で使用するので、標準エラー出力にログを出力します。受付番号やバージョンをログ出力しておけば、運営のミスを検出できる！
        self.playerIndex = playerIndex

    # アクションを選択します。
    def get_action(self, board, players, turn, led_color, legal_actions):
        # 最初に捨てるカードを選びます。
        def discard_hand():
            # 大胆なので、最も小さな手札を破棄します。
            return first(sorted(distinct(players[self.playerIndex]['hands'])))

        # 勝利数を予測します。
        def predict_wins_count():
            # 大胆なので、最大の勝利数を予測します。
            return 3

        # 色を宣言してカードを出します。
        def declare_observed_color():
            # パラドックスは受け入れます。
            if len(legal_actions) == 1 and legal_actions[0] == 'paradox':
                return 'paradox'

            # 数字が大きい順に並べた重複なしの手札。
            hands = tuple(reversed(sorted(distinct(players[self.playerIndex]['hands']))))

            if turn == 0:
                # 合法手の中から、最も数字が大きい手を選択します。
                return first(filter(identity,
                                    map(lambda hand: first(filter(lambda legal_action: legal_action['hand'] == hand,
                                                                  legal_actions)),
                                        hands)))
            else:
                # 基準色と同じで、最も数字が大きい手を選択します。
                result = first(filter(identity,
                                      map(lambda hand: first(filter(lambda legal_action: legal_action['hand'] == hand and legal_action['color'] == led_color,
                                                                    legal_actions)),
                                          hands)))

                # 見つからない場合は……
                if not result:
                    # 合法手の中から、色が赤で、最も数字が大きい手を選択します。
                    result = first(filter(identity,
                                          map(lambda hand: first(filter(lambda legal_action: legal_action['hand'] == hand and legal_action['color'] == 'red',
                                                                        legal_actions)),
                                              hands)))

                # 見つからない場合は……
                if not result:
                    # 負け確定なので、最も数字が小さい手を選択します。
                    result = first(filter(identity,
                                          map(lambda hand: first(filter(lambda action: action['hand'] == hand,
                                                                        legal_actions)),
                                              reversed(hands))))

                #  リターン。
                return result

        # Python3.10で追加されたmatchで分岐して、処理を振り分けます。
        match players[self.playerIndex]['phase']:
            case 0:
                return discard_hand()

            case 1:
                return predict_wins_count()

            case 2:
                return declare_observed_color()

    # 状態を調べます。
    def observe(self, board, players, turn, led_color, actionPlayerIndex, action):
        #  本当はここで状態の推移を見て色々考えたい……。パラドックスしやすいうっかり屋とかの、敵の特性が分かるかもしれない。
        pass

    # ゲームを終了します。
    def end_game(self):
        print('終了', file=sys.stderr)


# プレイヤーを作成します。
player = BoldPlayer()

# node.jsからの起動で文字化けしたので、文字コードを指定して対策します。
sys.stdout = TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
sys.stderr = TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

# 無限ループ。
while True:
    # 標準入力からメッセージを受信します。
    message = json.loads(input())

    # Python3.10で追加されたmatchで分岐します。
    match message['command']:
        # ゲーム開始。
        case 'beginGame':
            player.begin_game(message['parameter']['playerIndex'])
            print(json.dumps('OK'))

        # アクション選択。
        case 'getAction':
            action = player.get_action(message['parameter']['board'],
                                       message['parameter']['players'],
                                       message['parameter']['turn'],
                                       message['parameter']['ledColor'],
                                       message['parameter']['legalActions'])
            print(json.dumps(action))

        # 状態を調べる。
        case 'observe':
            player.observe(message['parameter']['board'],
                           message['parameter']['players'],
                           message['parameter']['turn'],
                           message['parameter']['ledColor'],
                           message['parameter']['actionPlayerIndex'],
                           message['parameter']['action'])
            print(json.dumps('OK'))

        # ゲーム終了。
        case 'endGame':
            player.end_game()
            print(json.dumps('OK'))
            exit(0)  # プロセス終了
