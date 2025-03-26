// Amazon Cognito認証サービス
import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserAttribute,
  CognitoUserSession,
  ISignUpResult
} from 'amazon-cognito-identity-js';

// 環境変数から設定を取得
const REGION = import.meta.env.VITE_HUGMEDO_AWS_REGION || 'ap-northeast-1';
const USER_POOL_ID = import.meta.env.VITE_HUGMEDO_COGNITO_USER_POOL_ID || 'ap-northeast-1_GUV1R8FPD';
const CLIENT_ID = import.meta.env.VITE_HUGMEDO_COGNITO_CLIENT_ID || '3s2v8o84lsm666fjb28s99obih';

// Cognitoユーザープールの設定
const poolData = {
  UserPoolId: USER_POOL_ID,
  ClientId: CLIENT_ID
};

// 開発モードフラグ（環境変数が設定されていない場合）
const isDevelopmentMode = false; // 認証情報が揃ったので開発モードをオフに

// ユーザープールインスタンスを作成
const userPool = isDevelopmentMode ? null : new CognitoUserPool(poolData);

/**
 * Cognito認証サービス
 * 開発モードでは、モック認証を使用します
 */
export const cognitoAuthService = {
  /**
   * ユーザーのサインイン（ログイン）
   * @param username ユーザー名またはメールアドレス
   * @param password パスワード
   * @returns ログイン結果とユーザー情報
   */
  signIn: async (username: string, password: string): Promise<{ success: boolean; user?: any; token?: string; error?: string }> => {
    try {
      // 開発モードの場合はモック認証を使用
      if (isDevelopmentMode) {
        console.warn('Cognito認証情報が設定されていないため、モック認証を使用します');
        await new Promise(resolve => setTimeout(resolve, 1000)); // 遅延を模倣
        
        if (username === 'admin' && password === 'password') {
          return {
            success: true,
            user: {
              id: 'mock-user-id',
              username: 'admin',
              email: 'admin@example.com',
              name: '管理者',
              role: 'admin'
            },
            token: 'mock-token-' + Date.now()
          };
        } else if (username && password) {
          return {
            success: true,
            user: {
              id: 'mock-user-id-' + Date.now(),
              username,
              email: username.includes('@') ? username : `${username}@example.com`,
              name: 'テストユーザー',
              role: 'user'
            },
            token: 'mock-token-' + Date.now()
          };
        } else {
          return {
            success: false,
            error: 'ユーザー名とパスワードを入力してください'
          };
        }
      }

      // 実際のCognito認証
      if (!userPool) {
        throw new Error('Cognitoユーザープールが初期化されていません');
      }

      // 認証に必要な情報
      const authenticationDetails = new AuthenticationDetails({
        Username: username,
        Password: password
      });

      // ユーザーオブジェクトの作成
      const cognitoUser = new CognitoUser({
        Username: username,
        Pool: userPool
      });

      // 認証処理
      return new Promise((resolve, reject) => {
        cognitoUser.authenticateUser(authenticationDetails, {
          onSuccess: (session: CognitoUserSession) => {
            // トークンの取得
            const idToken = session.getIdToken().getJwtToken();
            const accessToken = session.getAccessToken().getJwtToken();
            
            // ユーザー属性の取得
            cognitoUser.getUserAttributes((err, attributes) => {
              if (err) {
                resolve({
                  success: true,
                  user: { username },
                  token: idToken
                });
                return;
              }

              // 属性からユーザー情報を構築
              const user = { username };
              attributes?.forEach(attr => {
                user[attr.getName()] = attr.getValue();
              });

              resolve({
                success: true,
                user,
                token: idToken
              });
            });
          },
          onFailure: (err) => {
            let errorMessage = 'ログインに失敗しました';
            
            // エラーメッセージの日本語化
            if (err.code === 'UserNotFoundException') {
              errorMessage = 'ユーザーが見つかりません';
            } else if (err.code === 'NotAuthorizedException') {
              errorMessage = 'パスワードが正しくありません';
            } else if (err.code === 'UserNotConfirmedException') {
              errorMessage = 'ユーザーが確認されていません。メールを確認してください';
            }
            
            resolve({
              success: false,
              error: errorMessage
            });
          }
        });
      });
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * ユーザーのサインアップ（登録）
   * @param username ユーザー名
   * @param password パスワード
   * @param email メールアドレス
   * @param attributes その他の属性
   * @returns 登録結果
   */
  signUp: async (
    username: string,
    password: string,
    email: string,
    attributes: Record<string, string> = {}
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      // 開発モードの場合はモック登録を使用
      if (isDevelopmentMode) {
        console.warn('Cognito認証情報が設定されていないため、モック登録を使用します');
        await new Promise(resolve => setTimeout(resolve, 1000)); // 遅延を模倣
        
        return {
          success: true
        };
      }

      // 実際のCognito登録
      if (!userPool) {
        throw new Error('Cognitoユーザープールが初期化されていません');
      }

      // 属性の設定
      const attributeList = [
        new CognitoUserAttribute({
          Name: 'email',
          Value: email
        })
      ];

      // その他の属性を追加
      Object.entries(attributes).forEach(([key, value]) => {
        attributeList.push(
          new CognitoUserAttribute({
            Name: key,
            Value: value
          })
        );
      });

      // ユーザー登録
      return new Promise((resolve, reject) => {
        userPool.signUp(
          username,
          password,
          attributeList,
          [],
          (err, result) => {
            if (err) {
              let errorMessage = '登録に失敗しました';
              
              // エラーメッセージの日本語化
              if (err.code === 'UsernameExistsException') {
                errorMessage = 'このユーザー名は既に使用されています';
              } else if (err.code === 'InvalidPasswordException') {
                errorMessage = 'パスワードの要件を満たしていません';
              } else if (err.code === 'InvalidParameterException') {
                errorMessage = '入力パラメータが無効です';
              }
              
              resolve({
                success: false,
                error: errorMessage
              });
              return;
            }

            resolve({
              success: true
            });
          }
        );
      });
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * ユーザーのサインアウト（ログアウト）
   */
  signOut: async (): Promise<void> => {
    try {
      // 開発モードの場合は何もしない
      if (isDevelopmentMode) {
        console.warn('Cognito認証情報が設定されていないため、モックログアウトを使用します');
        return;
      }

      // 現在のユーザーを取得
      const currentUser = userPool?.getCurrentUser();
      if (currentUser) {
        currentUser.signOut();
      }
    } catch (error) {
      console.error(error);
    }
  },

  /**
   * 現在のセッション状態を確認
   * @returns セッションが有効かどうか
   */
  checkSession: async (): Promise<boolean> => {
    try {
      // 開発モードの場合はローカルストレージをチェック
      if (isDevelopmentMode) {
        if (typeof localStorage !== 'undefined') {
          const token = localStorage.getItem('auth_token');
          const user = localStorage.getItem('auth_user');
          return !!(token && user);
        }
        return false;
      }

      // 実際のCognitoセッションチェック
      const currentUser = userPool?.getCurrentUser();
      if (!currentUser) {
        return false;
      }

      return new Promise((resolve) => {
        currentUser.getSession((err: Error | null, session: CognitoUserSession | null) => {
          if (err || !session || !session.isValid()) {
            resolve(false);
            return;
          }
          resolve(true);
        });
      });
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  /**
   * 現在のユーザー情報を取得
   * @returns ユーザー情報
   */
  getCurrentUser: async (): Promise<any | null> => {
    try {
      // 開発モードの場合はローカルストレージから取得
      if (isDevelopmentMode) {
        if (typeof localStorage !== 'undefined') {
          const userStr = localStorage.getItem('auth_user');
          if (userStr) {
            try {
              return JSON.parse(userStr);
            } catch (e) {
              return null;
            }
          }
        }
        return null;
      }

      // 実際のCognitoユーザー情報取得
      const currentUser = userPool?.getCurrentUser();
      if (!currentUser) {
        return null;
      }

      return new Promise((resolve) => {
        currentUser.getSession((err: Error | null, session: CognitoUserSession | null) => {
          if (err || !session || !session.isValid()) {
            resolve(null);
            return;
          }

          currentUser.getUserAttributes((attrErr, attributes) => {
            if (attrErr || !attributes) {
              resolve({ username: currentUser.getUsername() });
              return;
            }

            const user = { username: currentUser.getUsername() };
            attributes.forEach(attr => {
              user[attr.getName()] = attr.getValue();
            });

            resolve(user);
          });
        });
      });
    } catch (error) {
      console.error(error);
      return null;
    }
  }
};
