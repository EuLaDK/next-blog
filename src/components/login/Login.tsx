"use client"

// LoginDialog.tsx
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
// import { addUser } from '@/lib/login'
import { Card } from '@/components/ui/card'
import { Input } from "../ui/input"
import { isMainlandChinaPhoneNumber } from "./phone-validation"
import { useState } from "react"

const captchaChars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"

/**
 * 生成登录弹窗展示用的图形验证码。
 * @param length 验证码长度
 */
function createCaptchaCode(length = 4): string {
  return Array.from({ length }, () => captchaChars[Math.floor(Math.random() * captchaChars.length)]).join("")
}

type LoginDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onLoginSuccess?: () => void
}

export function LoginDialog({ open, onOpenChange, onLoginSuccess }: LoginDialogProps) {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [captchaInput, setCaptchaInput] = useState("")
  const [captchaCode, setCaptchaCode] = useState(() => createCaptchaCode())
  const [loginError, setLoginError] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const hasPhoneError = phoneNumber.length > 0 && !isMainlandChinaPhoneNumber(phoneNumber)

  /**
   * 刷新当前图形验证码内容。
   */
  const refreshCaptchaCode = () => {
    setCaptchaCode(createCaptchaCode())
  }

  /**
   * 校验登录表单并请求手机号登录接口。
   */
  const handleLogin = async () => {
    setLoginError("")

    if (!isMainlandChinaPhoneNumber(phoneNumber)) {
      setLoginError("请输入正确的手机号")
      return
    }

    if (captchaInput.trim().toUpperCase() !== captchaCode) {
      setLoginError("验证码不正确，请重新输入")
      refreshCaptchaCode()
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: phoneNumber,
        }),
      })

      if (!response.ok) {
        setLoginError("登录失败，请稍后重试")
        return
      }

      onLoginSuccess?.()
    } catch {
      setLoginError("登录失败，请检查网络后重试")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-125 w-full auto-rows-min content-start sm:max-w-175">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">登录</DialogTitle>
          </DialogHeader>
          <div className="flex flex-row mt-5 items-center justify-around">
            <div className="flex flex-col gap-5">
                <div className="space-y-2">
                  <InputGroup className="h-12">
                    <InputGroupInput
                      id={hasPhoneError ? "input-invalid" : "phone-input"}
                      aria-describedby={hasPhoneError ? "phone-error" : undefined}
                      aria-invalid={hasPhoneError}
                      placeholder="请输入手机号"
                      value={phoneNumber}
                      onChange={(event) => setPhoneNumber(event.target.value)}
                    />
                    <InputGroupAddon>
                      +86
                    </InputGroupAddon>
                  </InputGroup>
                  {hasPhoneError ? (
                    <p id="phone-error" className="text-xs font-medium text-destructive">
                      请输入正确的 11 位中国大陆手机号
                    </p>
                  ) : null}
                </div>
          <div className="flex flex-row gap-2">
            <Input
              className="h-12"
              id="input-button-group"
              placeholder="请输入验证码"
              value={captchaInput}
              onChange={(event) => setCaptchaInput(event.target.value)}
            />
            <button
              className="h-12 min-w-30 rounded-lg border border-foreground/15 bg-blue-100 px-4 text-center font-mono text-lg font-black tracking-[0.18em] text-foreground transition hover:border-foreground/35 hover:bg-[oklch(0.86_0.07_174)]"
              type="button"
              aria-label="刷新验证码"
              title="点击刷新验证码"
              onClick={refreshCaptchaCode}
            >
              {captchaCode}
            </button>
          </div>
          {loginError ? <p className="text-xs font-medium text-destructive">{loginError}</p> : null}
            </div>
            <Card className="flex flex-col w-60 h-69 pt-9 px-6 items-center">
                <div className="w-full flex-1 h-full bg-blue-300">
                    
                </div>
                <span className="text-xl flex flex-row">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M9.5 4C5.36 4 2 6.69 2 10c0 1.89 1.08 3.56 2.78 4.66L4 17l2.5-1.5c.89.31 1.87.5 2.91.5A5.22 5.22 0 0 1 9 14c0-3.31 3.13-6 7-6c.19 0 .38 0 .56.03C15.54 5.69 12.78 4 9.5 4m-3 2.5a1 1 0 0 1 1 1a1 1 0 0 1-1 1a1 1 0 0 1-1-1a1 1 0 0 1 1-1m5 0a1 1 0 0 1 1 1a1 1 0 0 1-1 1a1 1 0 0 1-1-1a1 1 0 0 1 1-1M16 9c-3.31 0-6 2.24-6 5s2.69 5 6 5c.67 0 1.31-.08 1.91-.25L20 20l-.62-1.87C20.95 17.22 22 15.71 22 14c0-2.76-2.69-5-6-5m-2 2.5a1 1 0 0 1 1 1a1 1 0 0 1-1 1a1 1 0 0 1-1-1a1 1 0 0 1 1-1m4 0a1 1 0 0 1 1 1a1 1 0 0 1-1 1a1 1 0 0 1-1-1a1 1 0 0 1 1-1"></path></svg>
                    微信扫码登录
                </span>
            </Card>
          </div>
          
          <DialogFooter className="mt-4 bg-white">
            <DialogClose asChild>
              <Button className="w-25 h-10" type="button" variant="outline">取消</Button>
            </DialogClose>
            <Button className="w-25 h-10" type="button" disabled={submitting} onClick={handleLogin}>
              {submitting ? "登录中" : "登录"}
            </Button>
          </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
